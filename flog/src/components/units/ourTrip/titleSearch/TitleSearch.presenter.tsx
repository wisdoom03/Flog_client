import * as Search from "./TitleSearch.styles";
import ContainedButton03 from "../../../commons/buttons/contained/03/ContainedButton03.container";

export default function TitleSearchUI(props) {
  return (
    <Search.Search>
      <Search.SearchBox type="text" />
      <ContainedButton03
        content="검색"
        size="large"
        onClick={props.onClickSearch}
      />
    </Search.Search>
  );
}