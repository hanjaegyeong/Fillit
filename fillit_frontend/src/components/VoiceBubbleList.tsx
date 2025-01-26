import VoiceBubbleItem from './VoiceBubbleItem';

const VoiceBubbleList = () => {
  // 임시데이터
  const items = [
    { name: 'Alex', nickname: '@chocolate' },
    { name: 'George', nickname: '@gowithout' },
    { name: 'Karen', nickname: '@potato153' },
    { name: 'Alex', nickname: '@chocolate2' },
    { name: 'Alex', nickname: '@chocolate3' },
    { name: 'George', nickname: '@gowithout2' },
    { name: 'Karen', nickname: '@potato154' },
  ];

  return (
    <div
      className="flex flex-col items-center"
      style={{
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '346px',
        maxHeight: 'calc(100vh - 43%)',
        overflow: 'hidden',
      }}
    >
      <h4 className="text-xl mb-2">Voice Bubbles</h4>
      <div className="w-full overflow-y-auto">
        {items.map((item) => (
          <VoiceBubbleItem
            key={item.nickname}
            name={item.name}
            nickname={item.nickname}
          />
        ))}
      </div>
    </div>
  );
};

export default VoiceBubbleList;
