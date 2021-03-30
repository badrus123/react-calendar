import { useMutation } from '@apollo/client'
import {
  Dialog,
  makeStyles,
  TextField,
  Typography,
  Button,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { ADD_TODOLIST, DELETE_TODO_LIST } from '../graphql/todolist'
import moment from 'moment'
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '24px',
  },
  form: {
    marginTop: '1rem',
  },
  flexDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: '1rem',
  },
  delete: {
    marginTop: '1rem',
  },
}))
const DialogSchedule = ({ open, handleClose, refetch }) => {
  const classes = useStyles()
  const [value, setValue] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
  })
  const [addMutation] = useMutation(ADD_TODOLIST)
  const [deleteMutation] = useMutation(DELETE_TODO_LIST)
  const handleChage = (name) => (e) => {
    setValue({ ...value, [name]: e.target.value })
  }
  const handleSubmit = () => {
    addMutation({ variables: value }).then((res) => {
      refetch()
      handleClose()
    })
  }
  const handleDelete = () => {
    deleteMutation({ variables: { id: open.data.id } }).then((res) => {
      refetch()
      handleClose()
    })
  }
  useEffect(() => {
    if (open.type === 'Detail') {
      setValue({
        title: open.data.title,
        description: open.data.description,
        start: open.data.start,
        end: open.data.end,
      })
    }
  }, [open])

  return (
    <Dialog open={open.open} onClose={handleClose} fullWidth maxWidth='md'>
      <div className={classes.root}>
        <Typography variant='h4'>{open.type} Schedule</Typography>
        <form className={classes.form} noValidate autoComplete='off'>
          <TextField
            variant='outlined'
            fullWidth
            label='Title Schedule'
            type='text'
            className={classes.form}
            value={value.title}
            onChange={handleChage('title')}
            disabled={open.type === 'Detail' ? true : false}
          />
          <TextField
            variant='outlined'
            fullWidth
            label='Description Schedule'
            multiline
            className={classes.form}
            rows={5}
            value={value.description}
            onChange={handleChage('description')}
            disabled={open.type === 'Detail' ? true : false}
          />
          <TextField
            variant='outlined'
            fullWidth
            label='Start Date'
            type='date'
            className={classes.form}
            value={moment(value.start).format('yyyy-MM-DD')}
            onChange={handleChage('start')}
            disabled={open.type === 'Detail' ? true : false}
          />
          <TextField
            variant='outlined'
            fullWidth
            label='End Date'
            type='date'
            className={classes.form}
            value={moment(value.end).format('yyyy-MM-DD')}
            onChange={handleChage('end')}
            disabled={open.type === 'Detail' ? true : false}
          />
        </form>
        {open.type === 'Add' ? (
          <div className={classes.flexDiv}>
            <Typography variant='body1' onClick={handleClose}>
              Cancel
            </Typography>
            <Button
              variant='contained'
              color='primary'
              size='large'
              onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        ) : (
          <Button
            variant='contained'
            color='secondary'
            size='large'
            fullWidth
            className={classes.delete}
            onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </Dialog>
  )
}

export default DialogSchedule
