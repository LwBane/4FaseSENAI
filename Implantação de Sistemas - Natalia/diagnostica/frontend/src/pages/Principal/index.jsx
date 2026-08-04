export default function Principal() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800">
        Bem-vindo, {usuario?.nome}!
      </h2>
    </div>
  );
}