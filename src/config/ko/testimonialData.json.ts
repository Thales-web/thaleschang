import Aniket from "@images/testimonials/aniket_p.jpg";
import BowTiedFocus from "@images/testimonials/BowTiedFocus.jpg";
import Connor from "@images/testimonials/connor.webp";
import Damiano from "@images/testimonials/damiano.jpg";
import David from "@images/testimonials/david-g-davedev.png";
import Geoffrey from "@images/testimonials/geoffrey.webp";

import { type TestimonialItem } from "../types/configDataTypes";

export const testimonialData: TestimonialItem[] = [
  {
    avatar: Geoffrey,
    name: "Geoffrey",
    title: "2020년부터 고객",
    testimonial: `첫 프리미엄 테마인 Galaxy를 사용해 봤는데, 개발자 경험이 정말 인상적이었습니다.
    README 문서, 스크립트, 그리고 투어 기능까지 모두 훌륭합니다. 정말 잘 만들었습니다.
    `,
  },
  {
    avatar: Connor,
    name: "Connor D",
    title: "2023년부터 고객",
    testimonial: `Thales Web은 견고한 Astro 기반 위에 만들어진 멋진 템플릿 이상의 가치를 제공합니다.
     활발한 커뮤니티를 운영하고 있으며, Discord와 GitHub 초대 같은 부가 혜택도 있어
     새로운 Astro 프로젝트를 시작하는 분이라면 당연한 선택입니다.
      `,
  },
  {
    avatar: BowTiedFocus,
    name: "BowTiedFocus",
    title: "2019년부터 고객",
    testimonial: `Blogsmith Pro 테마는 구성과 문서화가 놀라울 정도로 잘 되어 있습니다.
      이 테마를 분석하면서 Astro 개발에 대해 많은 것을 배웠고, 이미 일부 컴포넌트를
      웹 디자인 클라이언트 프로젝트에 활용하고 있습니다.
      `,
  },

  {
    avatar: Aniket,
    name: "Aniket P",
    title: "2022년부터 고객",
    testimonial: `저는 프론트엔드 개발자가 아니지만 개인 사이트를 Astro로 다시 만들고 싶었습니다.
    같은 상황이시라면 Thales Web을 강력히 추천합니다. 전체 과정에서 CSS 수정이 딱 한 번만 필요했습니다.
      `,
  },
  {
    avatar: David,
    name: "David G",
    title: "2022년부터 고객",
    testimonial: `지금까지 경험한 것 중 가장 깔끔한 템플릿 설정 경험이었습니다! Astro를 사용해 본 적은 없지만,
      데모와 코드를 보니 기존 React와 NextJS 경험을 바탕으로 쉽게 익힐 수 있을 것 같습니다.
      `,
  },
  {
    avatar: Damiano,
    name: "Damiano L",
    title: "2020년부터 고객",
    testimonial: `Thales Web은 최고 수준의 Astro 테마를 제공합니다. 디자인이 뛰어나고 커스터마이즈가 쉬우며,
    무엇보다 지원 및 기능 요청에 대한 팀의 대응이 매우 빠릅니다. 이 테마를 사용하면 디자인 걱정 없이
    콘텐츠 제작에만 집중할 수 있습니다.
      `,
  },
];

export default testimonialData;
