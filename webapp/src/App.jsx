import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';

// Lado do tutor
import Intro from './screens/tutor/Intro';
import Signup from './screens/tutor/Signup';
import Home from './screens/tutor/Home';
import Pet from './screens/tutor/Pet';
import Search from './screens/tutor/Search';
import Caregiver from './screens/tutor/Caregiver';
import Book from './screens/tutor/Book';
import Confirmed from './screens/tutor/Confirmed';
import Tracking from './screens/tutor/Tracking';
import Chat from './screens/tutor/Chat';
import Bookings from './screens/tutor/Bookings';
import Reminders from './screens/tutor/Reminders';
import Settings from './screens/tutor/Settings';

// Lado do cuidador
import CgHome from './screens/caregiver/CgHome';
import CgRequest from './screens/caregiver/CgRequest';
import CgActive from './screens/caregiver/CgActive';
import CgEarnings from './screens/caregiver/CgEarnings';
import CgProfile from './screens/caregiver/CgProfile';

export default function App() {
  return (
    <AppShell>
      <Routes>
        {/* Tutor. O ecrã 08 (Pagamento) do handoff está fora do fluxo por agora:
            agendar leva direto a confirmado, sem pagamentos na app. */}
        <Route path="/" element={<Intro />} />
        <Route path="/registo" element={<Signup />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/animal/:petId" element={<Pet />} />
        <Route path="/pesquisa" element={<Search />} />
        <Route path="/cuidador/:caregiverId" element={<Caregiver />} />
        <Route path="/agendar" element={<Book />} />
        <Route path="/confirmado" element={<Confirmed />} />
        <Route path="/acompanhar/:bookingId" element={<Tracking />} />
        <Route path="/conversa/:bookingId" element={<Chat />} />
        <Route path="/agendamentos" element={<Bookings />} />
        <Route path="/lembretes" element={<Reminders />} />
        <Route path="/conta" element={<Settings />} />

        {/* 15–19 · cuidador */}
        <Route path="/cuidar" element={<CgHome />} />
        <Route path="/cuidar/pedido/:bookingId" element={<CgRequest />} />
        <Route path="/cuidar/servico" element={<CgActive />} />
        <Route path="/cuidar/ganhos" element={<CgEarnings />} />
        <Route path="/cuidar/perfil" element={<CgProfile />} />

        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </AppShell>
  );
}
