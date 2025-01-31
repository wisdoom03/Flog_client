import { useMemo, useRef, useState, ChangeEvent, useEffect } from "react";
import TripWriteLogEditorUI from "./TripWriteLogEditor.presenter";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import {
  UPLOAD_FILE,
  UPDATE_BOARD,
  CREATE_BOARD,
} from "./TripWriteLogEditor.queries";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const ReactQuill = dynamic(
  async () => {
    const { default: QuillEditor } = await import("react-quill");

    // eslint-disable-next-line react/display-name
    return function ({ forwardedRef, ...props }) {
      return <QuillEditor ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

export default function TripWriteLogEditor(props) {
  const [contents, setContents] = useState(props.BoardData?.content || "");
  const [boardId, setBoardId] = useState(props.BoardData?.id || "");
  const [modalContents, setModalContents] = useState("");

  const quillRef = useRef();
  const router = useRouter();
  const [uploadBoardImagefile] = useMutation(UPLOAD_FILE);
  const [updateBoard] = useMutation(UPDATE_BOARD);
  const [createBoard] = useMutation(CREATE_BOARD);
  useEffect(() => {
    if (props.BoardData?.content) setContents(props.BoardData.content);
  }, [props.BoardData]);

  let quillCurrent: any;
  let editor: any;
  let currentFocus: any;

  const create = async () => {
    const result = await createBoard({
      variables: {
        createBoardInput: {
          day: String(props.index + 1),
          content: contents,
        },
        scheduleId: String(router.query.scheduleId),
      },
    });
    setBoardId(result.data?.createBoard?.id);
  };
  const update = async () => {
    try {
      const result = await updateBoard({
        variables: {
          updateBoardInput: {
            content: String(contents),
          },
          boardId: boardId || props.BoardData?.id,
        },
      });
    } catch (error) {
      alert(error.message);
    }
  };
  const submitDb = async () => {
    if (!contents) return;

    try {
      boardId || props.BoardData ? update() : create();
    } catch (error) {
      alert(error.message);
    }
  };
  const setRefValue = () => {
    quillCurrent = quillRef.current;
    editor = quillCurrent?.getEditor();
    currentFocus = quillCurrent?.getEditorSelection();
    if (!editor) return;
    editor.focus();
  };

  setRefValue();
  useEffect(() => {
    setRefValue();
    // eslint-disable-next-line no-useless-return
    if (props.selected?.length !== 3) return;
    else {
      addEl(props.selected[0], props.selected[1]);
    }
  }, [props.selected]);

  const addEl = (name: string, des: string) => {
    if (!editor) setRefValue();
    editor?.insertText(currentFocus?.index + 1, name, {
      header: 1,
      size: "large",
      color: "black",
    });
    currentFocus.index += name.length + 1;
    editor?.insertText(currentFocus.index, "  " + des, {
      header: 5,
      size: "small",
      background: "#fff",
      color: " #818181",
    });
    currentFocus.index += des.length + 2;

    editor?.insertText(currentFocus.index, "  " + " ", {
      header: 5,
      color: "black",
    });
    currentFocus.index += des.length + 8;
    editor.setSelection(currentFocus.index, 0, 0);
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("multiple", "true");
    input.setAttribute("className", "ImgUrl");
    input.setAttribute("accept", "image/*");
    document.body.appendChild(input);
    input.click();
    input.onchange = async (event: ChangeEvent<HTMLInputElement>) => {
      if (!editor) {
        setRefValue();
      }
      editor.focus();

      const file = event.target.files?.[0];
      const result = await uploadBoardImagefile({ variables: { file } });
      const fileUrl = result.data?.uploadBoardImagefile;
      editor.insertEmbed(
        quillCurrent.getEditorSelection().index,
        "image",
        `https://storage.cloud.google.com/${fileUrl}`
      );
      input.remove();
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, 7] }],
          [{ font: [] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            "link",
          ],
          [
            {
              // prettier-ignore
              color: [
                "#000000","#e60000","#ff9900","#ffff00","#008a00","#0066cc","#9933ff","#ffffff","#facccc","#ffebcc","#ffffcc","#cce8cc","#cce0f5","#ebd6ff","#bbbbbb","#f06666","#ffc266","#ffff66","#66b966","#66a3e0","#c285ff","#888888","#a10000","#b26b00","#b2b200","#006100","#0047b2","#6b24b2","#444444","#5c0000","#663d00","#666600","#003700","#002966","#3d1466","custom-color",
              ],
            },
            { background: [] },
            {},
          ],
          ["image", "video"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    []
  );

  const handleChange = (value) => {
    setContents(value);
    if (!props.selected) setModalContents("상세일정을 추가해주세요");
  };

  useEffect(() => {
    setRefValue();
  }, [imageHandler]);

  return (
    <TripWriteLogEditorUI
      ReactQuill={ReactQuill}
      addEl={addEl}
      handleChange={handleChange}
      contents={contents}
      modules={modules}
      quillRef={quillRef}
      index={props.index}
      el={props.el}
      dayRef={props.dayRef}
      isShow={props.isShow}
      saveButtonRef={props.saveButtonRef}
      submitDb={submitDb}
      BoardData={props.BoardData}
      modalContents={modalContents}
      setModalContents={setModalContents}
    />
  );
}
