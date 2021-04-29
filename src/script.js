class Calendar {
  constructor() {
    this.monthDiv = document.querySelector(".cal-month__current");
    this.headDivs = document.querySelectorAll(".cal-head__day");
    this.bodyDivs = document.querySelectorAll(".cal-body__day");
  }

  init(month) {
    moment.locale("ru");

    this.month = month ? moment(month, "MM") : moment();
    this.weekDays = moment.weekdaysShort(true);

    this.headDivs.forEach((day, index) => {
      day.innerText = this.weekDays[index];
    });

    this.update();
  }

  update() {
    this.calendarDays = {
      first: this.month.clone().startOf("month").startOf("week").date(),
      last: this.month.clone().endOf("month").date(),
    };

    this.monthDays = {
      lastPrevious: this.month
        .clone()
        .subtract(1, "months")
        .endOf("month")
        .date(),
      lastCurrent: this.month.clone().endOf("month").date(),
    };

    this.monthString = this.month.clone().format("MMMM");

    this.draw();
  }

  draw() {
    this.monthDiv.innerText = this.monthString;

    let index = 0;

    if (this.calendarDays.first > 1) {
      for (
        let day = this.calendarDays.first;
        day <= this.monthDays.lastPrevious;
        index++
      ) {
        this.bodyDivs[index].innerText = day++;

        this.cleanCssClasses(index);
      }
    }

    let isNextMonth = false;

    for (let day = 1; index <= this.bodyDivs.length - 1; index++) {
      if (day > this.monthDays.lastCurrent) {
        day = 1;
        isNextMonth = true;
      }

      this.cleanCssClasses(index);

      if (!isNextMonth) {
        this.bodyDivs[index].classList.add("cal-day__month--current");
      }

      this.bodyDivs[index].innerText = day++;
    }
  }

  cleanCssClasses(index) {
    this.bodyDivs[index].classList.contains("cal-day__month--current") &&
      this.bodyDivs[index].classList.remove("cal-day__month--current");
  }
}

const cal = new Calendar();
cal.init();

const preview = (e) => {
  const month = document.getElementById("monthInput").value;
  const wallpaper = document.getElementById("wallpaper");
  const image = document.getElementById("fileInput").files[0];
  const imageUrl = document.getElementById("urlInput").value;

  if (image) {
    var reader = new FileReader();

    reader.onloadend = function () {
      wallpaper.style.background = `url('${reader.result}') center center no-repeat`;
      wallpaper.style.backgroundSize = "cover";
    };

    reader.readAsDataURL(image);
  }

  if (imageUrl) {
    wallpaper.style.background = `url('${imageUrl}') center center no-repeat`;
    wallpaper.style.backgroundSize = "cover";
  }

  cal.init(month);
};

const download = (e) => {
  const wallpaper = document.getElementById("wallpaper");

  domtoimage.toJpeg(wallpaper, { quality: 0.95 }).then((dataUrl) => {
    let link = document.createElement("a");
    link.download = "calendar.jpeg";
    link.href = dataUrl;
    link.click();
  });
};
