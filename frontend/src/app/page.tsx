export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center gradient-primary">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">FileShare</h1>
        <p className="text-2xl mb-8">Referral & Credit System</p>
        <div className="space-x-4">
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="inline-block px-6 py-3 bg-primary-dark text-white rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Register
          </a>
        </div>
      </div>
    </main>
  );
}
