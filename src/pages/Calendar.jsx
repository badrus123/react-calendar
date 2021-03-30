import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { QUERY_TODOLIST } from '../graphql/todolist'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import moment from 'moment'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import DialogSchedule from '../component/Dialog'
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginTop: '1rem',
    justifyContent: 'flex-end',
    marginRight: '1rem',
  },
}))
const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })

export default function CalendarComponent() {
  const classes = useStyles()
  const [open, setOpen] = useState({
    open: false,
    type: null,
    data: null,
  })
  const localizer = momentLocalizer(moment)
  let allViews = Object.keys(Views).map((k) => Views[k])
  const { data, loading, refetch } = useQuery(QUERY_TODOLIST)
  if (loading) {
    return <div>loading</div>
  }
  const handleClose = () => {
    setOpen({
      open: false,
      type: null,
      data: null,
    })
  }

  const handleAdd = () => {
    setOpen({
      open: true,
      type: 'Add',
      data: null,
    })
  }
  const detailDialog = (event) => {
    setOpen({
      open: true,
      type: 'Detail',
      data: event,
    })
  }
  return (
    <div>
      <div className={classes.root}>
        <Button
          variant='contained'
          size='large'
          color='primary'
          onClick={handleAdd}>
          Add Schedule
        </Button>
      </div>
      <Calendar
        style={{
          minHeight: '100vh',
          padding: '24px',
        }}
        events={data.todolistapp}
        selectable
        views={allViews}
        step={60}
        defaultDate={new Date()}
        components={{
          timeSlotWrapper: ColoredDateCellWrapper,
        }}
        startAccessor='start'
        endAccessor='end'
        onSelectEvent={(event) => detailDialog(event)}
        localizer={localizer}
        eventPropGetter={(event) => {
          if (Date.parse(event.end) <= Date.parse(new Date())) {
            return {
              style: {
                backgroundColor: 'green',
              },
            }
          } else {
            return {
              style: {
                backgroundColor: 'blue',
              },
            }
          }
        }}
      />
      <DialogSchedule open={open} handleClose={handleClose} refetch={refetch} />
    </div>
  )
}
