<template>
  <div>
    <table class="table sticky-top" style="background-color:white">
      <thead>
        <tr class="table-primary">
          <th scope="col">ממוצע נוכחי</th>
          <th scope="col">ממוצע משופר</th>
          <th scope="col">שיפור</th>
          <th scope="col">נ"ז</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ avg.score }}</td>
          <td>{{ avg.new_score }}</td>
          <td style="direction: ltr;">
            {{ (avg.new_score - avg.score).toFixed(2) }}
          </td>
          <td>{{ avg.tot_credit }}</td>
        </tr>
      </tbody>
    </table>
    <br />

    <div class="container">
      <div class="row">
        <div class="col-md-6 mx-auto">
          <div class="card border-info mb-3">
            <div class="card-header">הוסף קורס</div>
            <div class="card-body">
              <form id="myForm" v-on:submit.prevent="addCourse">
                <div class="row">
                  <div class="col">
                    <input
                      type="text"
                      v-model="temp_grade.course"
                      class="form-control"
                      placeholder="שם קורס"
                      aria-label="First name"
                    />
                  </div>
                  <div class="col">
                    <input
                      type="text"
                      v-model="temp_grade.credit"
                      class="form-control"
                      placeholder='נ"ז'
                      aria-label="Last name"
                    />
                  </div>
                  <div class="col">
                    <input
                      type="text"
                      v-model="temp_grade.grade"
                      class="form-control"
                      placeholder="ציון"
                      aria-label="Last name"
                    />
                  </div>
                </div>
                <br />
                <button
                  type="submit"
                  class="btn btn-primary"
                  @click="addCourse"
                >
                  הוסף קורס</button
                ><br /><br />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <table class="table  table-striped table-hover">
      <thead>
        <tr class="table-primary">
          <th scope="col">#</th>
          <th scope="col">#</th>
          <th scope="col">קורס</th>
          <th scope="col">נ"ז</th>
          <th scope="col">ציון</th>
          <th scope="col">שיפור ציון</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(grade, i) in grades" :key="i">
          <th scope="row">{{ i + 1 }}</th>
          <td style="padding: 8px 0px 0px 0px;">
            <img
              @click="hide(i)"
              :src="!grade.hidden ? 'eye-solid.svg' : 'eye-slash-solid.svg'"
              alt=""
              style="max-width:20px"
            />
          </td>
          <td style="word-break: break-word;">{{ grade.course }}</td>
          <td>{{ grade.credit }}</td>
          <td>{{ grade.grade }}</td>
          <td>
            <input
              style="width:50px"
              type="text"
              v-model="grade.new_grade"
              @input="calc_avg()"
            />
          </td>
          <td>
            <img src="times-solid.svg" @click="removeG(i)" style="width:15px" />
          </td>
        </tr>
        <tr v-if="grades.length > 0">
          <th scope="row">#</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <button type="button" class="btn btn-primary" @click="resetG()">
              איפוס
            </button>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <div class="accordion" id="accordionExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="false"
            aria-controls="collapseOne"
          >
            העתק \ הדבק נתונים ממכשיר אחר
          </button>
        </h2>
        <div
          id="collapseOne"
          class="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <button type="submit" class="btn btn-primary" @click="copyData">
              העתק נתונים
            </button>
            <div v-if="copyD == true">
              <br />
              <p style="color:red">
                הנתונים הועתקו, כעת הכנס לאתר דרך מכשיר אחר והדבק את הנתונים.
              </p>
            </div>
            <hr />
            <div class="row">
              <div class="col">
                <input
                  type="text"
                  v-model="pasteData"
                  class="form-control"
                  placeholder="הדבק נתונים"
                />
              </div>
            </div>
            <br />
            <button type="submit" class="btn btn-success" @click="enterData">
              הכנס נתונים</button
            ><br /><br />
          </div>
        </div>
      </div>
    </div>
    <br /><br /><br />
  </div>
</template>

<script>
export default {
  data() {
    return {
      copyD: false,
      pasteData: "",
      grades: [],
      temp_grade: [],
      sum: 0,
      tot_credit: 0,
      avg: {
        score: 0,
        new_score: 0,
        sum: 0,
        sum_new: 0,
        tot_credit: 0,
        hidden: 0,
      },
      imporved: "",
    };
  },
  computed: {},
  methods: {
    copyData() {
      this.copyD = true;

      if (localStorage.getItem("gradesArr") != null) {
        this.$copyText(localStorage.getItem("gradesArr"));
      }
    },
    enterData() {
      console.log(this.pasteData.length);

      if (this.pasteData.length != 0) {
        try {
          var d = JSON.parse(this.pasteData);

          if (d && typeof d === "object" && d.length != 0) {
            localStorage.setItem("gradesArr", this.pasteData);
            this.pasteData = "";
            alert("הנתונים הוכנסו בהצלחה!");
            window.location.reload();
          } else {
            alert("יש בעיה עם הנתונים");
          }
        } catch {
          alert("יש בעיה עם הנתונים");
        }
      } else {
        alert("יש בעיה עם הנתונים");
      }
    },
    hide(i) {
      this.grades[i].hidden = !this.grades[i].hidden;
      this.calc_avg();
    },
    addCourse() {
      console.log(Number.isInteger(parseInt(this.temp_grade.grade)));
      if (
        Number.isInteger(parseInt(this.temp_grade.grade)) &&
        !isNaN(parseFloat(this.temp_grade.credit))
      ) {
        this.grades.push({
          grade: this.temp_grade.grade,
          new_grade: this.temp_grade.grade,
          credit: this.temp_grade.credit,
          course: this.temp_grade.course,
          hidden: 0,
        });
        this.temp_grade.grade = this.temp_grade.new_grade = this.temp_grade.credit = this.temp_grade.course =
          "";
        this.calc_avg();
        console.log(this.temp_grade);
      }

      document.getElementById("myForm").reset();
    },
    resetG() {
      for (var i = 0; i < this.grades.length; i++) {
        this.grades[i].new_grade = this.grades[i].grade;
        console.log(this.grades[i].new_score);
      }

      this.calc_avg();
    },
    removeG(i) {
      this.grades.splice(i, 1);
      this.calc_avg();
    },
    calc_avg() {
      localStorage.setItem("gradesArr", JSON.stringify(this.grades));

      if (this.grades.length == 0) {
        this.avg.score = 0;
        this.avg.new_score = 0;
        this.avg.tot_credit = 0;
        return;
      }

      this.avg.sum_new = 0;
      this.avg.sum = 0;
      this.avg.tot_credit = 0;

      for (var i = 0; i < this.grades.length; i++) {
        if (this.grades[i].hidden == 0 || this.grades[i].hidden == undefined) {
          this.avg.sum_new += parseFloat(
            this.grades[i].new_grade * this.grades[i].credit
          );
          this.avg.sum += parseFloat(
            this.grades[i].grade * this.grades[i].credit
          );
          this.avg.tot_credit += parseFloat(this.grades[i].credit);
        }
      }

      this.avg.score = parseFloat(this.avg.sum / this.avg.tot_credit).toFixed(
        2
      );
      this.avg.new_score = parseFloat(
        this.avg.sum_new / this.avg.tot_credit
      ).toFixed(2);

      console.log(this.avg);
    },
  },
  created() {
    if (localStorage.getItem("gradesArr") != null) {
      this.grades = JSON.parse(localStorage.getItem("gradesArr"));
    }

    this.calc_avg();
  },

  beforeCreate() {
    if (localStorage.getItem("gradesArr") != null) {
      try {
        if (
          Array.isArray(JSON.parse(localStorage.getItem("gradesArr"))) == false
        )
          localStorage.removeItem("gradesArr");
      } catch (e) {
        localStorage.removeItem("gradesArr");
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.input-group {
  margin-left: 10px;
}
</style>
