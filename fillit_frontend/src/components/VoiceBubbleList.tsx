import VoiceBubbleItem from './VoiceBubbleItem';

const VoiceBubbleList = () => {
  // 임시데이터
  const items = [
    { name: 'Alex', nickname: '@chocolate' },
    { name: 'George', nickname: '@gowithout' },
    { name: 'Samantha', nickname: '@flowerpower' },
    { name: 'Elizabeth', nickname: '@queenbee' },
  ];

  return (
    <div
      className="flex flex-col items-center"
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-55%)',
        width: '100%',
        padding: '0 20px', // 양옆 여백
      }}
    >
      <h4 className="text-xl ">Voice Bubbles</h4>
      {items.map((item) => (
        <VoiceBubbleItem
          key={item.nickname}
          name={item.name}
          nickname={item.nickname}
        />
      ))}
    </div>
  );
};

export default VoiceBubbleList;
