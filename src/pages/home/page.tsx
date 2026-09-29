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

const HomePage = () => {
  return (
    <div className="mx-auto box-border w-full max-w-[1040px] px-6 py-12">
      <title>3D FAB · 페이지 모음</title>
      <header className="mb-9">
        <p className="my-3 text-xs leading-[normal] font-bold tracking-[2px] text-[#39736f]">3D FACTORY LAB</p>
        <h1 className="mt-2 mb-3 text-4xl leading-[normal] font-bold tracking-[-1px]">3D FAB</h1>
        <p className="my-4 leading-[1.7] text-[#58677c]">작은 오브젝트부터 반도체 공장까지. 살펴볼 페이지를 선택하세요.</p>
      </header>
      <section aria-labelledby="factory-heading">
        <h2 className="mb-3.5 text-lg leading-[normal] font-bold" id="factory-heading">공장 만들기</h2>
        <Link className="flex flex-col gap-3 rounded-xl border p-[22px] text-[#172033] no-underline hover:border-[#57918b] hover:bg-[#f1f8f6] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#287f79] border-[#c5dbd5] bg-[#e8f2ef]" to="/factory">
          <span className="text-[11px] font-bold tracking-[1px] text-[#39736f]">FACTORY · 01</span>
          <strong className="flex justify-between gap-3 text-[17px]">컨베이어 라인 <span className="text-[#73928e]" aria-hidden="true">↗</span></strong>
          <span className="text-[13px] leading-[1.7] text-[#58677c]">1×1 컨베이어와 네 방향으로 이동하는 웨이퍼 운반함을 만나보세요.</span>
        </Link>
      </section>
      <section className="mt-8" aria-labelledby="lessons-heading">
        <h2 className="mb-3.5 text-lg leading-[normal] font-bold" id="lessons-heading">단계별 학습</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3.5">
          {lessons.map(({ step, title, description }) => (
            <Link className="flex flex-col gap-3 rounded-xl border p-[22px] text-[#172033] no-underline hover:border-[#57918b] hover:bg-[#f1f8f6] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#287f79] border-[#dce2eb] bg-white" key={step} to={`/steps/${step}`}>
              <span className="text-[11px] font-bold tracking-[1px] text-[#39736f]">STEP {step}</span>
              <strong className="flex justify-between gap-3 text-[17px]">{title} <span className="text-[#73928e]" aria-hidden="true">↗</span></strong>
              <span className="text-[13px] leading-[1.7] text-[#58677c]">{description}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
