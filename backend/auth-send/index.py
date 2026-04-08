import json
import os
import random
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Отправить OTP-код на номер телефона для входа в мессенджер"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    phone = (body.get('phone') or '').strip()

    if not phone or len(phone) < 10:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Укажите номер телефона'})}

    # Нормализуем номер
    digits = ''.join(c for c in phone if c.isdigit())
    if digits.startswith('8'):
        digits = '7' + digits[1:]
    if not digits.startswith('7') or len(digits) != 11:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неверный формат номера. Пример: +7 900 123-45-67'})}

    phone_norm = '+' + digits
    code = str(random.randint(100000, 999999))

    conn = get_db()
    cur = conn.cursor()
    schema = os.environ.get('MAIN_DB_SCHEMA', 't_p24027735_messenger_max_projec')

    # Помечаем старые коды как использованные
    cur.execute(f"UPDATE {schema}.otp_codes SET used=TRUE WHERE phone=%s AND used=FALSE", (phone_norm,))
    # Создаём новый код
    cur.execute(f"INSERT INTO {schema}.otp_codes (phone, code) VALUES (%s, %s)", (phone_norm, code))
    conn.commit()
    cur.close()
    conn.close()

    # В продакшене здесь был бы SMS-провайдер
    # Для демо — возвращаем код в ответе
    print(f"OTP для {phone_norm}: {code}")

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'ok': True,
            'phone': phone_norm,
            'demo_code': code,  # убрать в продакшене
            'message': f'Код отправлен на {phone_norm}'
        })
    }
