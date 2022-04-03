import ContainedButton03 from "../../../commons/buttons/contained/03/ContainedButton03.container";
import TripWriteBanner from "../banner/TripWriteBanner.container";
import TripWriteBottomBar from "../bottomBar/TripWriteBottomBar.container";
import TripWriteNavigation from "../navigation/TripWriteNavigation.container";
import TripWriteLogList from "./list/TripWriteLogList.container";
import { useRouter } from "next/router";

import * as Log from "./TripWriteLog.styles";
export default function TripWriteLogUI(props) {
  const router = useRouter();
  return (
    <Log.Container>
      <TripWriteBanner />

      {props.isEdit ? (
        <TripWriteNavigation />
      ) : (
        <Log.Bar>
          <Log.MoveBack
            onClick={() => {
              router.push("/myTrips");
            }}
          >
            <img src="/img/mytrips-write-log1.png" />
            나의 여행 목록으로
          </Log.MoveBack>

          {/* prettier-ignore */}
          <Log.BtnGroup>
          <div className="share" onClick={props.shareBtn}><img src="/img/mytrips-share-icon.png"/>우리의 여행에 공유하기 </div>
          <div >수정</div>
          <div className="delete">삭제</div>
        </Log.BtnGroup>
        </Log.Bar>
      )}

      <Log.Contents>
        <Log.InnerWrap>
          <Log.PlanBox>
            {props.isMine || props.isEdit || (
              <Log.UserInfo>
                <img src="/img/ourtrips-detail-usericon.png" />
                <Log.Name>사용자 이름</Log.Name>
                <Log.Email>test@gmail.com</Log.Email>
                {/* prettier-ignore */}
                <ContainedButton03 content="포인트 후원하기" size="small"onClick={() => { "/";}}
            />
              </Log.UserInfo>
            )}
            {props.isEdit || (
              <Log.PlanBtnGroup>
                <Log.moveBtn>전체 일정</Log.moveBtn>
                <Log.moveBtn>전체 예산</Log.moveBtn>
              </Log.PlanBtnGroup>
            )}
            <Log.PlanWrapper>
              {[1, 1, 1, 1].map((_, dayIndex) => (
                <Log.DayWrapper key={dayIndex}>
                  <Log.Day>{dayIndex + 1}일차</Log.Day>
                  <Log.ToggleImg
                    src="/img/mytrips-write-log2.png"
                    onClick={props.toggle(dayIndex)}
                  />
                  <Log.isShow isShow={props.isShow[dayIndex]}>
                    <TripWriteLogList
                      key={dayIndex}
                      index={dayIndex}
                      isEdit={props.isEdit}
                      saveButtonRef={props.saveButtonRef}
                    />
                  </Log.isShow>
                </Log.DayWrapper>
              ))}
            </Log.PlanWrapper>
          </Log.PlanBox>
        </Log.InnerWrap>
      </Log.Contents>

      <TripWriteBottomBar saveButtonRef={props.saveButtonRef} />
    </Log.Container>
  );
}
