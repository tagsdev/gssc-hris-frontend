<template>
  <q-card
    dark
    class="bg-primary inoutclock q-pa-md"
  >
    <q-card-section class="q-pa-none">
      <div class="row justify-between items-center">
        <div class="col-3 text-center">
          <p class="time relative-position">{{hours}} <span class="time-separator absolute">:</span></p>
          <p class="time-label">Hours</p>
        </div>
        <div class="col-3 text-center">
          <p class="time relative-position">{{minutes}} <span class="time-separator absolute">:</span></p>
          <p class="time-label">Minutes</p>
        </div>
        <div class="col-3 text-center">
          <p class="time relative-position">{{seconds}} <span class="time-separator absolute">:</span></p>
          <p class="time-label">Seconds</p>
        </div>
        <div class="col-3 text-center">
          <p class="time relative-position">{{period}}</p>
          <p class="time-label">Period</p>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <div class="row justify-center">
        <div class="col-6 text-center">
          <q-btn flat icon="login" label="Time In" class="inout" :class="[ clockedIn ? 'inactive' : 'active' ]" :disable="clockedIn" @click="inout"></q-btn>
        </div>
        <div class="col-6 text-center">
          <q-btn flat icon="logout" label="Time Out" class="inout" :class="[ clockedIn ? 'active' : 'inactive' ]" :disable="!clockedIn" @click="inout"></q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <p class="text-center last-activity">Last Activity: Timed Out Yesterday, 4:00 PM</p>
    </q-card-section>
  </q-card>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  name: 'TimeClock',
  data() {
    return {
      hours: '',
      minutes: '',
      seconds: '',
      period: '',
      clockedIn: false
    }
  },
  mounted() {
    this.getCurrentTime()
  },
  methods: {
    getCurrentTime() {
      setInterval(() => {
        let currentTime = DateTime.now()
        this.hours = currentTime.toFormat('hh')
        this.minutes = currentTime.toFormat('mm')
        this.seconds = currentTime.toFormat('ss')
        this.period = currentTime.toFormat('a')
      }, 1000)
    },
    inout() {
      this.clockedIn = !this.clockedIn
    }
  }
}
</script>

<style>
.inoutclock {
  border-radius: 20px !important;
  filter: drop-shadow(0px 10px 20px #0075B8);
}

.time {
  color: #FFFFFF;
  font-size: 36px;
  text-shadow: 5px 5px 3px rgba(0, 0, 0, 0.2);
  font-weight: 500;
  margin: 14px 0;
}


.time-separator {
  color: rgba(255, 255, 255, 0.3);
  font-size: 18px;
  font-weight: 500;
  right: 0;
  top: 18px;
}

.time-label {
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  margin: 14px;
}

.inout {
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
}

.inout.active {
  color: #FFFFFF;
}

.inout.inactive {
  color: rgba(255, 255, 255, 0.3);
}

.last-activity {
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
  font-weight: 400;
  font-style: italic;
  margin: 14px;
}
</style>