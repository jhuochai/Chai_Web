export default function IncubationPod({ title, status }) {
  return (
    <article className="incubation-pod" aria-labelledby="incubation-title">
      <div className="incubation-pod__crown" aria-hidden="true"><i /><i /><i /></div>
      <div className="incubation-pod__glass" aria-hidden="true">
        <span className="incubation-pod__scan" />
        <span className="incubation-pod__core"><i /><i /><i /></span>
        <span className="incubation-pod__rings" />
      </div>
      <div className="incubation-pod__console">
        <p id="incubation-title">{title}</p>
        <p>{status}</p>
      </div>
    </article>
  );
}
