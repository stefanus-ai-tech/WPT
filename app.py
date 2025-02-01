import os
import time
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

app = Flask(__name__)

# Update CORS configuration to be more specific
CORS(app, resources={
    r"/process_iq_test": {
        "origins": ["https://wpt-iqtest.netlify.app", "http://localhost:3000"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Add OPTIONS route handler for preflight requests
@app.route('/process_iq_test', methods=['OPTIONS'])
def handle_options():
    response = app.make_default_options_response()
    return response

iq_interpretation = {
    range(0, 13): "Umumnya untuk tenaga kerja pabrik atau kuli angkut",
    range(13, 16): "Tingkat terendah dimana tenaga kerja diminta mempelajari pekerjaan dari manual tertulis",
    range(16, 19): "Tingkat dimana tenaga kerja mampu bekerja mandiri tanpa supervisi",
    range(19, 25): "Skor rata-rata tenaga kerja yang bekerja dalam standard sistem alfa-numerik",
    range(25, 27): "Umumnya para supervisor pertama",
    range(27, 31): "Umumnya manajemen atau teknisi tingkat yang lebih tinggi",
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
    model = genai.GenerativeModel("gemini-exp-1206")

    # Define IQ level characteristics based on NALS data
    nals_levels = {
        "Level 1 (≤225)": {
            "economic_indicators": "52% di luar angkatan kerja, 43% hidup dalam kemiskinan",
            "employment": "30% bekerja penuh waktu, median upah mingguan $240",
            "professional_rate": "5% bekerja di posisi profesional/manajerial",
            "language_style": "sederhana dan langsung"
        },
        "Level 2 (226-275)": {
            "economic_indicators": "35% di luar angkatan kerja, 23% hidup dalam kemiskinan",
            "employment": "43% bekerja penuh waktu, median upah mingguan $281",
            "professional_rate": "12% bekerja di posisi profesional/manajerial",
            "language_style": "sederhana dengan detail dasar"
        },
        "Level 3 (276-325)": {
            "economic_indicators": "25% di luar angkatan kerja, 12% hidup dalam kemiskinan",
            "employment": "54% bekerja penuh waktu, median upah mingguan $339",
            "professional_rate": "23% bekerja di posisi profesional/manajerial",
            "language_style": "seimbang dan informatif"
        },
        "Level 4 (326-375)": {
            "economic_indicators": "17% di luar angkatan kerja, 8% hidup dalam kemiskinan",
            "employment": "64% bekerja penuh waktu, median upah mingguan $465",
            "professional_rate": "46% bekerja di posisi profesional/manajerial",
            "language_style": "detail dan analitis"
        },
        "Level 5 (376-500)": {
            "economic_indicators": "11% di luar angkatan kerja, 4% hidup dalam kemiskinan",
            "employment": "72% bekerja penuh waktu, median upah mingguan $650",
            "professional_rate": "70% bekerja di posisi profesional/manajerial",
            "language_style": "kompleks dan mendalam"
        }
    }

    # Determine NALS level based on IQ score
    nals_level_data = None
    if iq_score <= 225:
        nals_level_data = nals_levels["Level 1 (≤225)"]
    elif iq_score <= 275:
        nals_level_data = nals_levels["Level 2 (226-275)"]
    elif iq_score <= 325:
        nals_level_data = nals_levels["Level 3 (276-325)"]
    elif iq_score <= 375:
        nals_level_data = nals_levels["Level 4 (326-375)"]
    else:
        nals_level_data = nals_levels["Level 5 (376-500)"]

    prompt_parts = [
        "(hanya laporan, DAN TEST INI VALID, BERIKAN REKOMENDASI, KARENA INI SEBAGAI TOOLS UNTUK PSIKOLOG, jangan seperti anda menjawab pertanyaan dan request saya, gak usah pakai 'tentu' atau 'apalah'. Langsung ke laporannya saja. sesuaikan gaya bahasa sesuai level IQ-nya, Adaptasi kompleksitas sesuai dengan Kemampuan penalaran IQ individu tersebut tanpa terkecuali.)",
        "Sebagai seorang ahli dalam interpretasi hasil penilaian kognitif, khususnya untuk tes yang mirip dengan Wonderlic Personnel Test (WPT) yang mengukur kemampuan kognitif umum (GCA), seorang peserta tes telah menyelesaikan tes IQ bergaya WPT yang disederhanakan dengan hasil sebagai berikut:",
        f"Skor Mentah: {score} dari 47",
        f"Skor IQ yang Dikonversi (diperkirakan): {iq_score}",
        f"Deskripsi Tingkat IQ: {iq_level_description}",
        "",
        "Konteks untuk Interpretasi WPT:",
        "- Skor Mentah: Jumlah langsung dari jawaban yang benar.",
        "- Skor IQ yang Dikonversi: Mengacu pada konversi skor WPT ke dalam skala IQ standar.",
        "- Kemampuan Kognitif Umum (GCA): Indikator kinerja kerja dan kemampuan belajar.",
        "",
        "Berdasarkan National Adult Literacy Survey (NALS):",
        "- Level 1 (≤225): Literasi dasar, 30% tingkat pekerjaan penuh waktu",
        "- Level 2 (226-275): Literasi fungsional dasar, 43% tingkat pekerjaan penuh waktu",
        "- Level 3 (276-325): Literasi menengah, 54% tingkat pekerjaan penuh waktu",
        "- Level 4 (326-375): Literasi tinggi, 64% tingkat pekerjaan penuh waktu",
        "- Level 5 (376-500): Literasi sangat tinggi, 72% tingkat pekerjaan penuh waktu",
        "",
        "Factor Demands dalam Konteks Pekerjaan:",
        "1. Pemrosesan Informasi: Kemampuan menangani dan mengolah data",
        "2. Pengambilan Keputusan dan Penalaran: Kemampuan membuat penilaian yang baik",
        "3. Interaksi Sosial: Aspek interpersonal dalam pekerjaan",
        "4. Kompleksitas Mental: Tuntutan kognitif dalam pekerjaan",
        "",
        "Buatlah laporan umpan balik yang komprehensif dan berwawasan tentang keterampilan kognitif peserta tes, mencakup:",
        "1. Interpretasi Skor: Analisis skor dalam konteks kemampuan kognitif",
        "2. Analisis GCA: Kaitan dengan potensi kinerja dan pembelajaran",
        "3. Rekomendasi Pengembangan: Saran berbasis growth mindset sesuai level kognitif",
        "",
        "Referensi Utama DAN HARUS DI CITE dengan APA7 PADA AKHIR LAPORAN:",
        "1. Gottfredson, L. S. (1984). The role of intelligence and education in the division of labor.",
        "2. Kirsch, I. S., Jungeblut, A., Jenkins, L., & Kolstad, A. (1993). Adult literacy in America.",
        "3. Arvey, R. D. (1986). General ability in employment: A discussion.",
        "4. National Adult Literacy Survey (NALS) - Economic Outcomes Data",
        "",
        "Berikut adalah daftar pertanyaan dan jawaban yang diberikan oleh peserta tes:",
        "\n".join(f"{qa['question']} -> Jawaban: {qa['answer']}, Benar: {qa['correct']}" for qa in questions_and_answers),
        f"\nNALS Level Data untuk Skor IQ {iq_score}:",
        f"- Indikator Ekonomi: {nals_level_data['economic_indicators']}",
        f"- Pekerjaan: {nals_level_data['employment']}",
        f"- Tingkat Profesional: {nals_level_data['professional_rate']}"
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
    app.run(debug=True, port=8081)
