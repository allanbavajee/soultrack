/* pages/login.js */
<div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
  <form
    onSubmit={handleLogin}
    className="bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-6 w-full max-w-md"
  >
    {/* Titre avec logo */}
    <h2 className="text-2xl font-bold flex items-center justify-center gap-3">
      <img src="/logo.png" alt="Logo" className="w-8 h-8" />
      Connexion SoulTrack
    </h2>

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="border rounded-xl px-4 py-2 w-full"
      required
    />

    <input
      type="password"
      placeholder="Mot de passe"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="border rounded-xl px-4 py-2 w-full"
      required
    />

    <button
      type="submit"
      disabled={loading}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-all duration-200"
    >
      {loading ? "Connexion..." : "Se connecter"}
    </button>

    {error && <p className="text-red-500 text-center">{error}</p>}
  </form>
</div>
