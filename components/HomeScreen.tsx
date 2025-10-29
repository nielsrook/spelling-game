
import React from 'react';
import { GameMode } from '../types';

interface HomeScreenProps {
  onStartGame: (mode: GameMode) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame }) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl border border-gray-200">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
          Welkom bij WerkwoordSpel!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Kies een modus om je kennis van de Nederlandse werkwoordspelling te testen en te verbeteren.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => onStartGame(GameMode.Practice)}
            className="bg-teal-50 p-6 rounded-lg border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-400 cursor-pointer transition-all duration-300 transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-teal-800 mb-2">Oefenmodus</h2>
            <p className="text-teal-700">
              Speel in je eigen tempo. Krijg direct feedback en uitleg bij elke vraag.
            </p>
          </div>
          <div
            onClick={() => onStartGame(GameMode.Challenge)}
            className="bg-sky-50 p-6 rounded-lg border-2 border-sky-200 hover:bg-sky-100 hover:border-sky-400 cursor-pointer transition-all duration-300 transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-sky-800 mb-2">Uitdagingsmodus</h2>
            <p className="text-sky-700">
              Test je kennis met 10 vragen. Krijg je score en een overzicht aan het einde.
            </p>
          </div>
        </div>
      </div>
       <footer className="mt-8 text-sm text-gray-500">
        <p>Gemaakt voor het MBO onderwijs. AI-gegenereerde vragen voor eindeloos oefenplezier.</p>
      </footer>
    </div>
  );
};

export default HomeScreen;
