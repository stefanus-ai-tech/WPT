import os
import time
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)

iq_interpretation = {
    range(0, 13): "Umumnya untuk tenaga kerja pabrik atau kuli angkut",
    range(13, 16): "Tingkat terendah dimana tenaga kerja diminta mempelajari pekerjaan dari manual tertulis",
    range(16, 19): "Tingkat dimana tenaga kerja mampu bekerja mandiri tanpa supervisi",
    range(19, 25): "Skor rata-rata tenaga kerja yang bekerja dalam standard sistem alfa-numerik",
    range(25, 27): "Umumnya para supervisor pertama",
    range(27, 31): "Umumnya manajemen tenga atau teknisi tingkat yang lebih tinggi",
    range(31, 51): "Umumnya para profesional dan manajer eksekutif"
}

def get_iq_level_description(score):
    for score_range, description in iq_interpretation.items():
        if score in score_range:
            return description
    return "Deskripsi level IQ tidak tersedia untuk skor ini."

def calculate_iq(score, total_questions=40):
    percentage_correct = (score / total_questions) * 100
    iq_estimate = 100

    if percentage_correct >= 90:
        iq_estimate = 140 + (percentage_correct - 90) * 2
    elif percentage_correct >= 80:
        iq_estimate = 130 + (percentage_correct - 80)
    elif percentage_correct >= 70:
        iq_estimate = 120 + (percentage_correct - 70)
    elif percentage_correct >= 50:
        iq_estimate = 100 + (percentage_correct - 50) * 0.8
    elif percentage_correct >= 30:
        iq_estimate = 90 - (50 - percentage_correct) * 0.5
    else:
        iq_estimate = 70 - (30 - percentage_correct) * 0.3

    return round(iq_estimate)

def generate_gemini_feedback(score, iq_score, iq_level_description, questions_and_answers):
    model = genai.GenerativeModel("gemini-pro")

    prompt_parts = [
        f"Sebagai seorang ahli dalam interpretasi hasil penilaian kognitif, khususnya untuk tes yang mirip dengan Wonderlic Personnel Test (WPT), yang mengukur kemampuan kognitif umum (GCA), seorang peserta tes telah menyelesaikan tes IQ bergaya WPT yang disederhanakan dan mencapai hal berikut:",
        f"Skor Mentah: {score} dari 40",
        f"Skor IQ yang Dikonversi (diperkirakan): {iq_score}",
        f"Deskripsi Tingkat IQ: {iq_level_description}",
        "Konteks untuk Interpretasi WPT (dari dokumen yang disediakan):",
        "- Skor Mentah: Jumlah langsung dari jawaban yang benar.",
        "- Skor IQ yang Dikonversi: Skor mentah WPT dapat dikonversi menjadi skor IQ, sebanding dengan skor IQ standar seperti WAIS-R FSIQ.",
        "- Kemampuan Kognitif Umum (GCA): WPT mengukur GCA, terkait dengan skor pencari kerja dan GCA pekerjaan.",
        "- Skor Komposit: Mirip dengan penilaian seperti SB5 (rata-rata 100, SD 15), skor turunan WPT dapat diinterpretasikan dengan cara yang sama.",
        "Berdasarkan informasi ini, berikan laporan umpan balik yang komprehensif dan berwawasan tentang keterampilan kognitif peserta tes.",
        "Laporan tersebut harus mencakup:",
        "1. Interpretasi Skor Mentah: Jelaskan secara singkat apa yang ditunjukkan oleh skor mentah dalam hal jumlah pertanyaan yang dijawab dengan benar dan tingkat kesulitan tes secara keseluruhan.",
        "2. Analisis Skor IQ yang Dikonversi: Jelaskan perkiraan skor IQ dalam konteks skala IQ umum. Jelaskan apa yang biasanya menandakan rentang skor IQ ini mengenai kemampuan kognitif.",
        "3. Penilaian Kemampuan Kognitif Umum (GCA): Berdasarkan skor tersebut, berikan penilaian GCA peserta tes. Kaitkan ini dengan potensi kinerja pekerjaan atau kemampuan belajar, karena WPT sering digunakan untuk penyaringan pekerjaan.",
        "4. Ringkasan Keterampilan Kognitif Secara Keseluruhan: Ringkaslah kekuatan kognitif peserta tes dan area untuk pengembangan potensial berdasarkan interpretasi gabungan dari skor mentah, skor IQ, dan GCA. Pertahankan nada yang profesional dan informatif.",
        "Hasilkan laporan umpan balik terperinci minimal tiga paragraf.",
        "Berikut adalah pertanyaan dan jawaban yang diberikan oleh peserta tes:",
        "\n".join(f"{qa['question']} -> Jawaban: {qa['answer']}, Benar: {qa['correct']}" for qa in questions_and_answers)
    ]

    response = model.generate_content(prompt_parts)
    return response.text

@app.route('/test_llm_connection', methods=['GET'])
def test_llm_connection():
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content("This is a test.")

        if response and response.text:
            return jsonify({'status': 'success', 'message': 'LLM Connection Successful'})
        else:
            return jsonify({'status': 'error', 'message': 'LLM Connection Failed', 'error': 'No response text from LLM'})

    except Exception as e:
        return jsonify({'status': 'error', 'message': 'LLM Connection Failed', 'error': str(e)})

@app.route('/process_iq_test', methods=['POST'])
def process_iq_test():
    data = request.get_json()
    score = data.get('score')
    user_responses = data.get('user_responses')

    if score is None:
        return jsonify({'error': 'Score not provided'}), 400
    if user_responses is None:
        return jsonify({'error': 'User responses not provided'}), 400

    iq_level_description = get_iq_level_description(score)
    iq_score_estimate = calculate_iq(score)
    
    questions_and_answers = []
    for response in user_responses:
        question_text = response['question']
        answer_text = response['answer']
        is_correct = response['correct']
        questions_and_answers.append({
            'question': question_text,
            'answer': answer_text,
            'correct': is_correct
        })

    gemini_feedback = generate_gemini_feedback(score, iq_score_estimate, iq_level_description, questions_and_answers)

    return jsonify({
        'iq_level_description': iq_level_description,
        'iq_score': iq_score_estimate,
        'gemini_feedback': gemini_feedback
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)