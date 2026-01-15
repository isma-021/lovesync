#!/usr/bin/env python3
"""
Script de prueba para verificar que el servidor Python en localhost:8000 
está funcionando correctamente y recibiendo peticiones del backend Node.js

Uso:
    python3 test_matches_api.py
"""

import requests
import json

def test_matches_api():
    """Prueba la API de matches del servidor Python"""
    
    print("🧪 Iniciando prueba del servidor de matches...")
    print()
    
    # URL del servidor Python
    url = "http://localhost:8000/matches"
    
    # Payload de prueba (como lo enviará el backend Node.js)
    payload = {
        "bio": "Soy algo friki",
        "intereses": ["gym", "libros", "series", "gatos"]
    }
    
    print(f"📤 Enviando petición a: {url}")
    print(f"📋 Payload: {json.dumps(payload, indent=2)}")
    print()
    
    try:
        # Hacer la petición
        response = requests.post(url, json=payload, timeout=5)
        
        print(f"✅ Respuesta recibida (Status: {response.status_code})")
        print()
        
        # Mostrar la respuesta
        data = response.json()
        print(f"📥 Respuesta JSON:")
        print(json.dumps(data, indent=2))
        print()
        
        # Validar estructura de respuesta
        if "total_matches" in data and "matches" in data:
            print(f"✅ Estructura correcta")
            print(f"   - Total de matches: {data['total_matches']}")
            print(f"   - Matches en lista: {len(data['matches'])}")
            
            if len(data['matches']) > 0:
                print(f"   - Primer match: {data['matches'][0]['match_nombre']}")
                print(f"   - Score: {data['matches'][0]['score']}")
        else:
            print("⚠️  Estructura incorrecta en la respuesta")
            
    except requests.exceptions.ConnectionError:
        print("❌ No se pudo conectar a localhost:8000")
        print("   Verifica que el servidor Python esté en ejecución")
        print("   Comando: python app.py")
        
    except requests.exceptions.Timeout:
        print("❌ Timeout: El servidor Python tardó demasiado en responder")
        
    except requests.exceptions.JSONDecodeError:
        print("❌ La respuesta no es JSON válido")
        print(f"   Respuesta: {response.text}")
        
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

if __name__ == "__main__":
    test_matches_api()
