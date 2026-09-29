import { Link } from "react-router";

const lessons = [
  { step: "01", title: "첫 번째 박스", description: "3D 공간에 첫 번째 오브젝트를 표시합니다." },
  { step: "02", title: "바닥과 기준 격자", description: "바닥과 격자로 공간의 기준을 만듭니다." },
  { step: "03", title: "마우스로 둘러보기", description: "카메라를 회전하고 확대하며 장면을 살펴봅니다." },
  { step: "04", title: "조명과 재질", description: "빛과 재질로 오브젝트의 입체감을 표현합니다." },
  { step: "05", title: "장비 한 대 조립", description: "여러 부품을 조합해 공장 장비를 만듭니다." },
  { step: "06", title: "장비 배치와 통로", description: "장비를 배치하고 운반 통로를 확보합니다." },
  { step: "07", title: "장비 선택", description: "장비를 클릭하고 선택한 대상을 확인합니다." },
  { step: "08", title: "장비 상태", description: "장비의 가동 상태를 확인하고 변경합니다." },
  { step: "09", title: "운반체 이동", description: "공장 통로를 따라 움직이는 운반체를 살펴봅니다." },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <title>3D FAB · 페이지 모음</title>
      <header className="home-header">
        <p className="home-eyebrow">3D FACTORY LAB</p>
        <h1>3D FAB</h1>
        <p>작은 오브젝트부터 반도체 공장까지. 살펴볼 페이지를 선택하세요.</p>
      </header>
      <section aria-labelledby="factory-heading">
        <h2 id="factory-heading">공장 만들기</h2>
        <Link className="home-card home-factory" to="/factory">
          <span className="home-card-number">FACTORY · 01</span>
          <strong>컨베이어 라인 <span aria-hidden="true">↗</span></strong>
          <span>1×1 컨베이어와 네 방향으로 이동하는 웨이퍼 운반함을 만나보세요.</span>
        </Link>
      </section>
      <section aria-labelledby="lessons-heading">
        <h2 id="lessons-heading">단계별 학습</h2>
        <div className="home-grid">
          {lessons.map(({ step, title, description }) => (
            <Link className="home-card" key={step} to={`/steps/${step}`}>
              <span className="home-card-number">STEP {step}</span>
              <strong>{title} <span aria-hidden="true">↗</span></strong>
              <span>{description}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
