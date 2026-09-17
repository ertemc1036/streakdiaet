# Streakdiät

React Native (Expo) App zum Tracken von Gewicht, Wasser und Mahlzeiten mit Tages-Streak
und optionaler Foto-Mahlzeitenanalyse per KI.

## Setup

```bash
npm install
npm start
```

Öffne die App danach in Expo Go (QR-Code scannen) oder in einem Simulator
(`npm run ios` / `npm run android`).

## Foto-Mahlzeitenanalyse aktivieren (optional)

Ohne API-Key funktioniert die App vollständig mit manueller Eingabe. Für die
KI-gestützte Analyse von Mahlzeitenfotos:

1. `.env.example` nach `.env` kopieren.
2. `EXPO_PUBLIC_ANTHROPIC_API_KEY` mit einem Key aus der
   [Anthropic Console](https://console.anthropic.com/) befüllen.
3. Dev-Server neu starten.

## Struktur

- `src/context/AppDataContext.tsx` – zentraler App-State (Gewicht, Wasser, Mahlzeiten,
  Einstellungen), persistiert lokal via AsyncStorage.
- `src/services/aiMealAnalysis.ts` – Anbindung an die Claude API für Foto-Analyse.
- `src/screens/` – Home, Tagebuch, Mahlzeit hinzufügen, Fortschritt, Einstellungen.
- `src/navigation/` – Tab- und Stack-Navigation.

Alle Daten werden aktuell nur lokal auf dem Gerät gespeichert (kein Backend).
