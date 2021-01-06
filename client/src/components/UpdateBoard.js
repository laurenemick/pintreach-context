import React, { useState, useEffect, useContext } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

import { BoardContext } from "../contexts/BoardContext";

import { TextField, InputLabel, Button, CardHeader } from "@material-ui/core";

function UpdateBoard(props) {
    const { setIsUpdated } = useContext(BoardContext);
    const [editBoard, setEditBoard] = useState({
        title: "",
        thumbnail: "",
    })

    const handleEdit = () => {
        // Base cases - if user leaves a field(s) blank, set field(s) to initial value
        const oldTitle = props.edit.title
        const oldThumbnail = props.edit.thumbnail
        let newEdit = {}

        if (editBoard.title === "" || editBoard.thumbnail === "") {
            if (editBoard.title === "") {
                newEdit = {...editBoard, title: oldTitle}
                console.log({...editBoard, title: oldTitle})
            } 
            else if (editBoard.thumbnail === "") {
                newEdit = {...editBoard, thumbnail: oldThumbnail}
            }
            else {
                newEdit = {title: oldTitle, thumbnail: oldThumbnail}
            }
        } else {
            newEdit = editBoard
        }

        axiosWithAuth()
            .put(`/boards/board/${props.edit.boardid}`, newEdit)
            .then((res) => {
                props.setFormOpen(false)
                props.setEdit({})
                setIsUpdated(true)
                setEditBoard({
                    title: "",
                    thumbnail: "",
                })
            })
            .catch(err => console.log(err))
    };

    const handleChange = event => {
        setEditBoard({
            ...editBoard, 
            [event.target.name]: event.target.value
        })
    }

    return (
        <div className="form">
            <div className="form-container1">
                <form>
                    <CardHeader title="Update Board" />
                    <InputLabel id="form-field" style={{ marginTop:"2px" }}>
                        Name: 
                        <TextField
                            id="title"
                            type="text"
                            name="title"
                            value={editBoard.title}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            style={{ marginTop: 4 }}
                            placeholder={props.edit.title}
                        />
                    </InputLabel>
                    <InputLabel id="form-field">
                        Thumbnail:
                        <TextField
                            type="text"
                            name="thumbnail"
                            value={editBoard.thumbnail}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            style={{ marginTop: 4 }}
                            placeholder={props.edit.thumbnail}
                        />
                    </InputLabel>
                    <Button 
                        id="btn"
                        variant="contained" 
                        size="small" 
                        style={{ marginTop: 30 }}
                        fullWidth
                        onClick={handleEdit}
                    >
                        Update
                    </Button>
                </form>
            </div>
        </div>
    )
};

export default UpdateBoard; 