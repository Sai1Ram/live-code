import CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/display/fullscreen.css";
import { Button, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { MdFormatAlignLeft } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import { ACTIONS } from "../actions/Action";

const CodeEditor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState("JavaScript");
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // function handleEditorDidMount(editor, monaco) {
  //   editorRef.current = editor;
  // }
  useEffect(() => {
    const init = async () => {
      const codeArea = document.getElementById("codeArea");
      if (codeArea) {
        editorRef.current = CodeMirror.fromTextArea(
          document.getElementById("codeArea"),
          {
            mode: { name: "javascript", json: true },
            theme: "dracula",
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
            // lineWrapping: true,
          }
        );
      }
      editorRef.current.setSize(null, "100%");
    };
    init();
  }, [roomId, socketRef]);
  if (editorRef.current) {
    editorRef.current.on("change", (event, instance) => {
      if (instance.origin !== "setValue" && event.getValue() !== null) {
        onCodeChange(event.getValue());
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          value: event.getValue(),
          roomId,
        });
      }
    });
  }
  useEffect(() => {
    if (socketRef.current === null) return;
    socketRef.current.on(ACTIONS.CODE_CHANGE, (value) => {
      editorRef.current.setValue(value || "");
    });
  }, [socketRef.current]);
  return (
    <div className="h-screen box-border rounded-md overflow-hidden bg-[#ffffff0f]">
      <div className="flex py-2 px-4 justify-between box-border h-[6vh] items-center">
        <div className="left w-24">
          <div>
            <Button
              onClick={handleClick}
              size="small"
              endIcon={<FaAngleDown color="text.secondary" />}
              color="secondary"
            >
              {language}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose}>Python</MenuItem>
              <MenuItem onClick={handleClose}>Java</MenuItem>
              <MenuItem onClick={handleClose}>C++</MenuItem>
            </Menu>
          </div>
        </div>
        <div className="right">
          <ul className="flex gap-2 items-center text-white">
            <li>
              <Tooltip title="Format Code" arrow>
                <IconButton
                  size="small"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#ffffff1f",
                    },
                  }}
                >
                  <MdFormatAlignLeft className="text-white" />
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Reset all" arrow>
                <IconButton
                  size="small"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#ffffff1f",
                    },
                  }}
                >
                  <VscDebugRestart className="text-white" />
                </IconButton>
              </Tooltip>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-[94vh] w-full">
        <textarea id="codeArea" className="h-full"></textarea>
      </div>
    </div>
  );
};

export default CodeEditor;
