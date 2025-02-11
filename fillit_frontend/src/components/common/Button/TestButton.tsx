import { postSignUp } from '@/api/signup';

export default function TestButton() {
  const fetchTest = async () => {
    try {
      const response = await postSignUp({
        regist: {
          type: 'user',
          password: 'testing',
          name: 'testing',
          personalId: 'testing',
          birthDate: new Date(),
          email: 'testing',
          introduction: 'testing hihihi',
        },
      });
      console.log('API 요청 결과:', response);
    } catch (error) {
      console.error('API 요청 실패:', error);
    }
  };

  return (
    <button
      onClick={fetchTest}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      테스트
    </button>
  );
}
