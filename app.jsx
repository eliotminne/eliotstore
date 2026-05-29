```jsx
import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "mamadou2.0";

export default function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);

  const [accessCode, setAccessCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [gameName, setGameName] = useState("");
  const [gameImage, setGameImage] = useState("");
  const [gameUrl, setGameUrl] = useState("");
  const [gameMode, setGameMode] = useState("iframe");

  useEffect(() => {
    const savedGames = localStorage.getItem("eliotstore_games");
    const savedAdmin = localStorage.getItem("eliotstore_admin");

    if (savedGames) {
      setGames(JSON.parse(savedGames));
    }

    if (savedAdmin === "true") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("eliotstore_games", JSON.stringify(games));
  }, [games]);

  const checkAccessCode = () => {
    if (accessCode === ADMIN_PASSWORD) {
      setIsAdmin(true);

      localStorage.setItem("eliotstore_admin", "true");

      setShowAccessModal(false);
      setShowGameModal(true);

      setAccessCode("");
    } else {
      alert("Code incorrect");
    }
  };

  const addGame = () => {
    if (!gameName || !gameUrl) {
      alert("Ajoute un nom et un lien.");
      return;
    }

    const newGame = {
      id: Date.now(),
      name: gameName,
      image: gameImage,
      url: gameUrl,
      mode: gameMode,
    };

    setGames([...games, newGame]);

    setGameName("");
    setGameImage("");
    setGameUrl("");
    setGameMode("iframe");

    setShowGameModal(false);
  };

  const deleteGame = (id) => {
    setGames(games.filter((game) => game.id !== id));
  };

  return (
    <div className="min-h-screen bg-white text-black overflow-y-auto relative">
      <div className="max-w-7xl mx-auto p-6 pb-32">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-3">
            EliotStore
          </h1>

          <p className="text-gray-600 text-lg">
            Plateforme de jeux.
          </p>
        </div>

        {games.length === 0 ? (
          <div className="bg-gray-100 border border-gray-300 rounded-3xl p-16 text-center shadow-xl">
            <h2 className="text-3xl font-bold mb-4">
              Aucun jeu ajouté
            </h2>

            <p className="text-gray-600">
              Clique sur le bouton + pour ajouter un jeu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {games.map((game) => (
              <div key={game.id}>
                <div className="relative">
                  <img
                    src={game.image}
                    alt={game.name}
                    onClick={() => setSelectedGame(game)}
                    className="w-full h-36 object-cover rounded-2xl border border-gray-300 shadow-lg cursor-pointer hover:scale-105 transition-all duration-300"
                  />

                  {isAdmin && (
                    <button
                      onClick={() => deleteGame(game.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                <h2 className="text-center text-lg font-bold mt-3 line-clamp-1">
                  {game.name}
                </h2>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedGame && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-300">
            <h2 className="text-2xl font-black">
              {selectedGame.name}
            </h2>

            <button
              onClick={() => setSelectedGame(null)}
              className="bg-red-500 text-white px-5 py-2 rounded-2xl font-bold"
            >
              Fermer
            </button>
          </div>

          {selectedGame.mode === "embed" ? (
            <embed
              src={selectedGame.url}
              className="w-full h-full bg-white"
            />
          ) : (
            <iframe
              src={selectedGame.url}
              title={selectedGame.name}
              className="w-full h-full bg-white"
              allowFullScreen
            />
          )}
        </div>
      )}

      <button
        onClick={() => {
          if (isAdmin) {
            setShowGameModal(true);
          } else {
            setShowAccessModal(true);
          }
        }}
        className="fixed bottom-5 left-5 w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-3xl font-bold text-white shadow-2xl transition-all hover:scale-110 z-40"
      >
        +
      </button>

      {showAccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-300 rounded-3xl p-6 w-full max-w-md shadow-2xl text-center">
            <h2 className="text-3xl font-black mb-4">
              Admin
            </h2>

            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Code secret"
              className="w-full bg-gray-100 border border-gray-300 rounded-2xl p-4 outline-none mb-5 text-center"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowAccessModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-3 rounded-2xl font-bold"
              >
                Annuler
              </button>

              <button
                onClick={checkAccessCode}
                className="flex-1 bg-green-500 hover:bg-green-400 py-3 rounded-2xl font-bold text-white"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}

      {showGameModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-gray-300 rounded-3xl p-6 w-full max-w-2xl shadow-2xl">
            <h2 className="text-3xl font-black mb-6">
              Ajouter un jeu
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-bold">
                  Nom du jeu
                </label>

                <input
                  type="text"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Minecraft"
                  className="w-full bg-gray-100 border border-gray-300 rounded-2xl p-4 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-bold">
                  Image du jeu
                </label>

                <div className="flex items-center gap-4">
                  {gameImage && (
                    <img
                      src={gameImage}
                      alt="preview"
                      className="w-24 h-24 rounded-2xl object-cover border border-gray-300"
                    />
                  )}

                  <label className="w-24 h-24 bg-gray-200 hover:bg-gray-300 border-2 border-dashed border-gray-400 rounded-2xl flex items-center justify-center text-5xl font-bold cursor-pointer transition">
                    +

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];

                        if (file) {
                          const reader = new FileReader();

                          reader.onloadend = () => {
                            setGameImage(reader.result);
                          };

                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-bold">
                  Lien du jeu / site
                </label>

                <input
                  type="text"
                  value={gameUrl}
                  onChange={(e) => setGameUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-gray-100 border border-gray-300 rounded-2xl p-4 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-bold">
                  Mode d'ouverture
                </label>

                <select
                  value={gameMode}
                  onChange={(e) => setGameMode(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-2xl p-4 outline-none"
                >
                  <option value="iframe">
                    iFrame
                  </option>

                  <option value="embed">
                    Embed
                  </option>
                </select>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setShowGameModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 py-4 rounded-2xl font-bold"
                >
                  Annuler
                </button>

                <button
                  onClick={addGame}
                  className="flex-1 bg-green-500 hover:bg-green-400 text-white py-4 rounded-2xl font-black"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-3 right-4 text-xs text-gray-500 z-30">
        En affiliation avec clemstore.vercel.app
      </div>
    </div>
  );
}
```
