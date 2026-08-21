import { forwardRef } from 'react';

const SkillsCabinet = forwardRef(function SkillsCabinet({ label, onOpen }, ref) {
  return (
    <button ref={ref} type="button" className="skills-cabinet" aria-label={label} onClick={onOpen}>
      <span className="skills-cabinet__header" aria-hidden="true"><i /><i /><i /></span>
      <span className="skills-cabinet__drawers" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => <i key={index}><b /></i>)}
      </span>
      <span className="skills-cabinet__plate">Skills</span>
    </button>
  );
});

export default SkillsCabinet;
