import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Drop from "./Dropdown04.styles";
export default function Dropdown04(props) {
  const LIST = ["전체보기", "제목", "여행 테마"];

  const [isSelect, setIsSelect] = useState(LIST[0]);
  const [isActive, setIsActive] = useState(false);

  const router = useRouter();

  const onClickSelectBtn = () => {
    setIsActive((prev) => !prev);
  };

  const onClickOption = (el) => () => {
    setIsSelect(el);
    if (el === "전체보기") router.push("/ourTrips");
    if (el === "제목") router.push("/ourTrips/titleSearch");
    if (el === "여행 테마") router.push("/ourTrips/tagSearch");
  };

  useEffect(() => {
    if (router.asPath.includes("/tagSearch")) {
      setIsSelect("여행테마");
    }
    if (router.asPath.includes("/titleSearch")) {
      setIsSelect("제목");
    }
  }, []);

  return (
    <>
      <Drop.SelectButton onClick={onClickSelectBtn}>
        <Drop.Selected>{isSelect}</Drop.Selected>
        <Drop.SelectIcon>
          <img src="/img/icon-modal-dropdown.svg" />
        </Drop.SelectIcon>
        {isActive && (
          <Drop.Option>
            <ul>
              {LIST.map((el) => (
                <li key={el}>
                  <span onClick={onClickOption(el)}>{el}</span>
                </li>
              ))}
            </ul>
          </Drop.Option>
        )}
      </Drop.SelectButton>
    </>
  );
}