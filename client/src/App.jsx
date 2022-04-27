import { Navbar, Transaction, Welcome, Footer } from './components';

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Transaction />
      <Footer />
    </div>
  );
};

export default App;
