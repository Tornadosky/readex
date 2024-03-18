import { testHighlights as _testHighlights } from "../test-highlights";
import QuizEditor from './QuizEditor';
import QuizSolver from './QuizSolver';
import '../style.css';

interface TestPageProps {
  isSolving: boolean;
}

const TestPage: React.FC<TestPageProps> = ({ isSolving }) => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {isSolving ? (
          <QuizSolver />
        ) :
        (
          <QuizEditor />
      )}
    </div>
  );
};

export default TestPage;