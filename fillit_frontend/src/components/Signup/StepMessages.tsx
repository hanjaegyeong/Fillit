interface SignupMessagesProps {
  messages: string[];
  typedMessages: string[];
}

const SignupMessages = ({ typedMessages }: SignupMessagesProps) => {
  return (
    <div className="flex flex-col items-center">
      {typedMessages.map((msg, index) => (
        <p
          key={index}
          className="inline-block text-center text-white bg-black px-2"
        >
          {msg}
        </p>
      ))}
    </div>
  );
};

export default SignupMessages;
