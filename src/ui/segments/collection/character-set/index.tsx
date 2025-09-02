import React from 'react';

const CharacterSetPanel = React.memo(() => {
  return (
    <div className="px-8 text-center">
      <h2 className="text-5xl font-black tracking-tight">Character Set</h2>
      <p className="mx-auto mt-3 max-w-3xl text-neutral-600">
        Here will be the character set please?
      </p>
    </div>
  );
});

CharacterSetPanel.displayName = 'CharacterSetPanel';

export default CharacterSetPanel;
