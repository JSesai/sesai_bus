import { AppRouter } from './router/routes.tsx';
import { Toaster } from 'sonner';
import WaitingRoom from './WaitingRoom/WaitingRoom.tsx';

const params = new URLSearchParams(window.location.search);
const isWaitingRoom = params.get('view') === 'waiting-room';

function App() {
  if (isWaitingRoom) {
    return <WaitingRoom />;
  }

  return (
    <>
      <Toaster />
      <AppRouter />
    </>
  )
}

export default App
