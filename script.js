// script.js
document.addEventListener("DOMContentLoaded", function () {
  var STORAGE_USERS = "offline_ir_users";
  var STORAGE_BOOKINGS = "offline_ir_bookings";
  var STORAGE_CURRENT = "offline_ir_current_user";

  var trains = [
    {
      id: "12001",
      name: "KOTA TO DELHI EXPRESS",
      from: "Kota",
      to: "Delhi",
      departure: "06:00",
      arrival: "14:00",
      classes: [
        { code: "CC", name: "Chair Car", fare: 1500, seats: 120 },
        { code: "2A", name: "AC 2 Tier", fare: 2200, seats: 80 }
      ]
    },
    {
      id: "12951",
      name: "Nanda devi express",
      from: "kota",
      to: "dehradun",
      departure: "16:30",
      arrival: "08:30",
      classes: [
        { code: "3A", name: "AC 3 Tier", fare: 2000, seats: 100 },
        { code: "2A", name: "AC 2 Tier", fare: 2900, seats: 80 },
        { code: "1A", name: "AC First Class", fare: 4200, seats: 40 }
      ]
    },
    {
      id: "12627",
      name: "Karnataka Express",
      from: "Bengaluru",
      to: "Delhi",
      departure: "19:20",
      arrival: "10:30",
      classes: [
        { code: "SL", name: "Sleeper", fare: 900, seats: 150 },
        { code: "3A", name: "AC 3 Tier", fare: 1700, seats: 100 },
        { code: "2A", name: "AC 2 Tier", fare: 2400, seats: 60 }
      ]
    },
    {
      id: "12009",
      name: "Ahmedabad Shatabdi",
      from: "Ahmedabad",
      to: "Mumbai",
      departure: "07:10",
      arrival: "13:20",
      classes: [
        { code: "CC", name: "Chair Car", fare: 900, seats: 110 },
        { code: "EC", name: "Exec Chair", fare: 1500, seats: 40 }
      ]
    },
    {
      id: "12839",
      name: "Howrah Mail",
      from: "Chennai",
      to: "Kolkata",
      departure: "23:00",
      arrival: "07:00",
      classes: [
        { code: "SL", name: "Sleeper", fare: 800, seats: 160 },
        { code: "3A", name: "AC 3 Tier", fare: 1500, seats: 90 }
      ]
    },
    {
      id: "12424",
      name: "Rajdhani Express",
      from: "Delhi",
      to: "Kolkata",
      departure: "16:50",
      arrival: "10:10",
      classes: [
        { code: "3A", name: "AC 3 Tier", fare: 1800, seats: 90 },
        { code: "2A", name: "AC 2 Tier", fare: 2600, seats: 60 },
        { code: "1A", name: "AC First Class", fare: 3800, seats: 30 }
      ]
    }
  ];

  var loginPage = document.getElementById("login-page");
  var homePage = document.getElementById("home-page");
  var bookPage = document.getElementById("book-page");
  var bookingsPage = document.getElementById("bookings-page");
  var pnrPage = document.getElementById("pnr-page");
  var schedulePage = document.getElementById("schedule-page");
  var profilePage = document.getElementById("profile-page");

  var nav = document.getElementById("main-nav");
  var logoutBtn = document.getElementById("logout-btn");
  var walletDisplay = document.getElementById("wallet-display");
  var welcomeText = document.getElementById("welcome-text");

  var authTabs = document.querySelectorAll(".auth-tab");
  var loginForm = document.getElementById("login-form");
  var registerForm = document.getElementById("register-form");
  var loginMessage = document.getElementById("login-message");
  var registerMessage = document.getElementById("register-message");

  var summaryBookings = document.getElementById("summary-bookings");
  var summarySpent = document.getElementById("summary-spent");
  var summaryActivePnrs = document.getElementById("summary-active-pnrs");

  var searchForm = document.getElementById("search-form");
  var fromStation = document.getElementById("from-station");
  var toStation = document.getElementById("to-station");
  var journeyDate = document.getElementById("journey-date");
  var journeyClass = document.getElementById("journey-class");
  var journeyQuota = document.getElementById("journey-quota");
  var searchMessage = document.getElementById("search-message");
  var trainsResults = document.getElementById("trains-results");

  var passengerCard = document.getElementById("passenger-card");
  var passengerForm = document.getElementById("passenger-form");
  var passengerName = document.getElementById("passenger-name");
  var passengerAge = document.getElementById("passenger-age");
  var passengerGender = document.getElementById("passenger-gender");
  var fareBase = document.getElementById("fare-base");
  var fareGst = document.getElementById("fare-gst");
  var fareTotal = document.getElementById("fare-total");
  var cancelPassengerBtn = document.getElementById("cancel-passenger");
  var bookingMessage = document.getElementById("booking-message");

  var bookingsBody = document.getElementById("bookings-body");

  var pnrForm = document.getElementById("pnr-form");
  var pnrInput = document.getElementById("pnr-input");
  var pnrMessage = document.getElementById("pnr-message");
  var pnrDetailsCard = document.getElementById("pnr-details-card");
  var pnrDetails = document.getElementById("pnr-details");

  var scheduleForm = document.getElementById("schedule-form");
  var scheduleFilter = document.getElementById("schedule-filter");
  var scheduleBody = document.getElementById("schedule-body");

  var profileDetails = document.getElementById("profile-details");
  var passwordForm = document.getElementById("password-form");
  var currentPassword = document.getElementById("current-password");
  var newPassword = document.getElementById("new-password");
  var passwordMessage = document.getElementById("password-message");

  var walletAddForm = document.getElementById("wallet-form");
  var walletAddAmount = document.getElementById("wallet-amount");
  var walletAddMessage = document.getElementById("wallet-message");

  var selectedBookingContext = null;

  function readFromStorage(key) {
    var raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
      return JSON.parse(raw) || [];
    } catch (e) {
      return [];
    }
  }

  function writeToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCurrentUser() {
    var raw = localStorage.getItem(STORAGE_CURRENT);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_CURRENT);
    } else {
      localStorage.setItem(STORAGE_CURRENT, JSON.stringify(user));
    }
  }

  function generatePNR() {
    var base = Date.now().toString().slice(-6);
    var rand = Math.floor(Math.random() * 900 + 100).toString();
    return base + rand.slice(0, 4);
  }

  function formatDateString(value) {
    if (!value) return "-";
    var parts = value.split("-");
    if (parts.length !== 3) return value;
    return parts[2] + "-" + parts[1] + "-" + parts[0];
  }

  function getSeatsBookedForTrainAndClass(trainId, classCode) {
    var bookings = readFromStorage(STORAGE_BOOKINGS);
    return bookings.filter(function (b) {
      return b.trainId === trainId && b.classCode === classCode && b.status === "CONFIRMED";
    }).length;
  }

  function getSeatsRemaining(train, classCode) {
    var cls = train.classes.find(function (c) {
      return c.code === classCode;
    });
    if (!cls) return 0;
    var booked = getSeatsBookedForTrainAndClass(train.id, classCode);
    var remaining = cls.seats - booked;
    return remaining < 0 ? 0 : remaining;
  }

  function switchPage(targetId) {
    var user = getCurrentUser();
    if (!user && targetId !== "login-page") {
      showAuthView();
      return;
    }
    var pages = document.querySelectorAll(".page");
    pages.forEach(function (p) {
      p.classList.remove("active");
    });
    var target = document.getElementById(targetId);
    if (target) {
      target.classList.add("active");
    }
    if (targetId === "home-page") {
      refreshDashboard();
    }
    if (targetId === "bookings-page") {
      renderBookingsTable();
    }
    if (targetId === "schedule-page") {
      renderScheduleTable();
    }
    if (targetId === "profile-page") {
      renderProfile();
    }
  }

  function setNavVisible(visible) {
    if (visible) {
      nav.style.display = "flex";
      logoutBtn.style.display = "inline-flex";
      walletDisplay.style.display = "inline-flex";
    } else {
      nav.style.display = "none";
      logoutBtn.style.display = "none";
      walletDisplay.style.display = "none";
    }
  }

  function showAuthView() {
    setNavVisible(false);
    switchPage("login-page");
  }

  function showAppView() {
    setNavVisible(true);
    switchPage("home-page");
  }

  function updateWalletDisplay() {
    var user = getCurrentUser();
    if (!user) {
      walletDisplay.textContent = "";
      return;
    }
    var users = readFromStorage(STORAGE_USERS);
    var fullUser = users.find(function (u) {
      return u.email === user.email;
    });
    if (fullUser) {
      walletDisplay.textContent = "Wallet: ₹" + fullUser.wallet.toFixed(0);
    }
  }

  function refreshDashboard() {
    var user = getCurrentUser();
    if (!user) return;
    welcomeText.textContent = "Welcome " + user.name + ", manage your journeys and bookings in one place.";
    var bookings = readFromStorage(STORAGE_BOOKINGS).filter(function (b) {
      return b.userEmail === user.email;
    });
    summaryBookings.textContent = bookings.length.toString();
    var spent = bookings.reduce(function (sum, b) {
      if (b.status === "CONFIRMED" || b.status === "CANCELLED") {
        return sum + b.amount;
      }
      return sum;
    }, 0);
    summarySpent.textContent = spent.toFixed(0);
    var active = bookings.filter(function (b) {
      return b.status === "CONFIRMED" || b.status === "WL";
    }).length;
    summaryActivePnrs.textContent = active.toString();
    updateWalletDisplay();
  }

  authTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      authTabs.forEach(function (t) {
        t.classList.remove("active");
      });
      tab.classList.add("active");
      var target = tab.getAttribute("data-auth-tab");
      var forms = document.querySelectorAll(".auth-form");
      forms.forEach(function (f) {
        f.classList.remove("active");
      });
      var targetForm = document.getElementById(target);
      if (targetForm) {
        targetForm.classList.add("active");
      }
      loginMessage.textContent = "";
      registerMessage.textContent = "";
      loginMessage.className = "auth-message";
      registerMessage.className = "auth-message";
    });
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    loginMessage.textContent = "";
    loginMessage.className = "auth-message";
    var email = document.getElementById("login-email").value.trim().toLowerCase();
    var password = document.getElementById("login-password").value;
    var users = readFromStorage(STORAGE_USERS);
    var user = users.find(function (u) {
      return u.email === email && u.password === password;
    });
    if (!user) {
      loginMessage.textContent = "Invalid email or password.";
      loginMessage.classList.add("error");
      return;
    }
    setCurrentUser({ email: user.email, name: user.name });
    loginForm.reset();
    showAppView();
    refreshDashboard();
  });

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    registerMessage.textContent = "";
    registerMessage.className = "auth-message";
    var name = document.getElementById("reg-name").value.trim();
    var email = document.getElementById("reg-email").value.trim().toLowerCase();
    var password = document.getElementById("reg-password").value;
    var wallet = parseFloat(document.getElementById("reg-wallet").value || "0");
    if (!name || !email || !password) {
      registerMessage.textContent = "Please fill all fields.";
      registerMessage.classList.add("error");
      return;
    }
    if (wallet < 3000) {
      registerMessage.textContent = "Minimum starting wallet balance is ₹3000.";
      registerMessage.classList.add("error");
      return;
    }
    var users = readFromStorage(STORAGE_USERS);
    var existing = users.find(function (u) {
      return u.email === email;
    });
    if (existing) {
      registerMessage.textContent = "An account with this email already exists.";
      registerMessage.classList.add("error");
      return;
    }
    var newUser = {
      name: name,
      email: email,
      password: password,
      wallet: isNaN(wallet) ? 0 : wallet,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeToStorage(STORAGE_USERS, users);
    registerMessage.textContent = "Registration successful. You can now login.";
    registerMessage.classList.add("success");
    registerForm.reset();
  });

  logoutBtn.addEventListener("click", function () {
    setCurrentUser(null);
    showAuthView();
  });

  if (nav) {
    nav.addEventListener("click", function (e) {
      if (e.target.matches(".nav-link")) {
        var target = e.target.getAttribute("data-target");
        var links = nav.querySelectorAll(".nav-link");
        links.forEach(function (l) {
          l.classList.remove("active");
        });
        e.target.classList.add("active");
        switchPage(target);
      }
    });
  }

  document.querySelectorAll("[data-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-target");
      var navLink = document.querySelector('.nav-link[data-target="' + target + '"]');
      if (navLink) {
        var links = nav.querySelectorAll(".nav-link");
        links.forEach(function (l) {
          l.classList.remove("active");
        });
        navLink.classList.add("active");
      }
      switchPage(target);
    });
  });

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var user = getCurrentUser();
    if (!user) {
      showAuthView();
      return;
    }
    searchMessage.textContent = "";
    searchMessage.className = "inline-message";
    passengerCard.classList.add("hidden");
    bookingMessage.textContent = "";
    var from = fromStation.value.trim().toLowerCase();
    var to = toStation.value.trim().toLowerCase();
    var date = journeyDate.value;
    var cls = journeyClass.value;
    var quota = journeyQuota.value;
    if (!from || !to || !date) {
      searchMessage.textContent = "Please fill From, To and Date.";
      searchMessage.classList.add("error");
      return;
    }
    var filtered = trains.filter(function (t) {
      var matchRoute =
        t.from.toLowerCase().indexOf(from) !== -1 &&
        t.to.toLowerCase().indexOf(to) !== -1;
      var classMatch =
        cls === "ANY" ||
        t.classes.some(function (c) {
          return c.code === cls;
        });
      return matchRoute && classMatch;
    });
    if (filtered.length === 0) {
      trainsResults.innerHTML =
        '<tr><td colspan="9" class="placeholder">No trains found for the given route.</td></tr>';
      searchMessage.textContent =
        "Try changing stations or class. Only a few sample routes are configured.";
      searchMessage.classList.add("error");
      return;
    }
    var html = "";
    filtered.forEach(function (t) {
      t.classes.forEach(function (c) {
        if (cls !== "ANY" && c.code !== cls) return;
        var remaining = getSeatsRemaining(t, c.code);
        html +=
          "<tr>" +
          "<td>" +
          t.id +
          "<div style='font-size:11px;color:#6b7280'>" +
          t.name +
          "</div></td>" +
          "<td>" +
          t.from +
          "</td>" +
          "<td>" +
          t.to +
          "</td>" +
          "<td>" +
          t.departure +
          "</td>" +
          "<td>" +
          t.arrival +
          "</td>" +
          "<td><span class='badge badge-class'>" +
          c.code +
          "</span></td>" +
          "<td>₹" +
          c.fare.toFixed(0) +
          "</td>" +
          "<td>" +
          remaining +
          "</td>" +
          "<td><button class='primary-btn' data-book-train='" +
          t.id +
          "' data-book-class='" +
          c.code +
          "' data-book-date='" +
          date +
          "' data-book-quota='" +
          quota +
          "' " +
          (remaining === 0 ? "disabled" : "") +
          ">Book</button></td>" +
          "</tr>";
      });
    });
    trainsResults.innerHTML = html || "<tr><td colspan='9' class='placeholder'>No matching classes.</td></tr>";
    searchMessage.textContent = "Select a train and click Book to proceed.";
    searchMessage.classList.add("success");
  });

  trainsResults.addEventListener("click", function (e) {
    if (e.target.matches("[data-book-train]")) {
      var trainId = e.target.getAttribute("data-book-train");
      var classCode = e.target.getAttribute("data-book-class");
      var date = e.target.getAttribute("data-book-date");
      var quota = e.target.getAttribute("data-book-quota");
      var train = trains.find(function (t) {
        return t.id === trainId;
      });
      if (!train) return;
      var cls = train.classes.find(function (c) {
        return c.code === classCode;
      });
      if (!cls) return;
      selectedBookingContext = {
        trainId: train.id,
        trainName: train.name,
        from: train.from,
        to: train.to,
        date: date,
        classCode: cls.code,
        className: cls.name,
        quota: quota,
        baseFare: cls.fare
      };
      var gst = Math.round(cls.fare * 0.05);
      var total = cls.fare + gst;
      fareBase.textContent = "₹" + cls.fare.toFixed(0);
      fareGst.textContent = "₹" + gst.toFixed(0);
      fareTotal.textContent = "₹" + total.toFixed(0);
      passengerCard.classList.remove("hidden");
      bookingMessage.textContent = "";
      bookingMessage.className = "inline-message";
    }
  });

  cancelPassengerBtn.addEventListener("click", function () {
    passengerForm.reset();
    passengerCard.classList.add("hidden");
    selectedBookingContext = null;
  });

  passengerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    bookingMessage.textContent = "";
    bookingMessage.className = "inline-message";
    var user = getCurrentUser();
    if (!user || !selectedBookingContext) {
      bookingMessage.textContent = "Session expired. Please search again.";
      bookingMessage.classList.add("error");
      return;
    }
    var name = passengerName.value.trim();
    var age = parseInt(passengerAge.value, 10);
    var gender = passengerGender.value;
    if (!name || !age || !gender) {
      bookingMessage.textContent = "Please fill all passenger details.";
      bookingMessage.classList.add("error");
      return;
    }
    var users = readFromStorage(STORAGE_USERS);
    var fullUser = users.find(function (u) {
      return u.email === user.email;
    });
    if (!fullUser) {
      bookingMessage.textContent = "User not found. Please login again.";
      bookingMessage.classList.add("error");
      return;
    }
    var amount = selectedBookingContext.baseFare;
    var gst = Math.round(amount * 0.05);
    var total = amount + gst;
    if (fullUser.wallet < total) {
      bookingMessage.textContent = "Insufficient wallet balance. Available: ₹" + fullUser.wallet.toFixed(0);
      bookingMessage.classList.add("error");
      return;
    }
    var train = trains.find(function (t) {
      return t.id === selectedBookingContext.trainId;
    });
    if (!train) {
      bookingMessage.textContent = "Train not found.";
      bookingMessage.classList.add("error");
      return;
    }
    var remaining = getSeatsRemaining(train, selectedBookingContext.classCode);
    var status = remaining > 0 ? "CONFIRMED" : "WL";
    var pnr = generatePNR();
    var bookings = readFromStorage(STORAGE_BOOKINGS);
    var newBooking = {
      pnr: pnr,
      userEmail: fullUser.email,
      trainId: selectedBookingContext.trainId,
      trainName: selectedBookingContext.trainName,
      from: selectedBookingContext.from,
      to: selectedBookingContext.to,
      date: selectedBookingContext.date,
      classCode: selectedBookingContext.classCode,
      className: selectedBookingContext.className,
      quota: selectedBookingContext.quota,
      passenger: {
        name: name,
        age: age,
        gender: gender
      },
      amount: total,
      status: status,
      bookedAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    writeToStorage(STORAGE_BOOKINGS, bookings);
    fullUser.wallet -= total;
    writeToStorage(STORAGE_USERS, users);
    setCurrentUser({ email: fullUser.email, name: fullUser.name });
    updateWalletDisplay();
    bookingMessage.textContent =
      "Booking successful. PNR: " + pnr + " (" + status + ")";
    bookingMessage.classList.add("success");
    passengerForm.reset();
    passengerCard.classList.add("hidden");
    selectedBookingContext = null;
    renderBookingsTable();
    refreshDashboard();
  });

  function renderBookingsTable() {
    var user = getCurrentUser();
    if (!user) return;
    var bookings = readFromStorage(STORAGE_BOOKINGS).filter(function (b) {
      return b.userEmail === user.email;
    });
    if (bookings.length === 0) {
      bookingsBody.innerHTML =
        "<tr><td colspan='9' class='placeholder'>No bookings yet</td></tr>";
      return;
    }
    bookings.sort(function (a, b) {
      return new Date(b.bookedAt) - new Date(a.bookedAt);
    });
    var html = "";
    bookings.forEach(function (b) {
      var badgeClass = "badge-status-confirmed";
      if (b.status === "WL") badgeClass = "badge-status-wl";
      if (b.status === "CANCELLED") badgeClass = "badge-status-cancelled";
      html +=
        "<tr>" +
        "<td>" +
        b.pnr +
        "</td>" +
        "<td>" +
        b.trainId +
        "<div style='font-size:11px;color:#6b7280'>" +
        b.trainName +
        "</div></td>" +
        "<td>" +
        formatDateString(b.date) +
        "</td>" +
        "<td>" +
        b.from +
        "</td>" +
        "<td>" +
        b.to +
        "</td>" +
        "<td><span class='badge badge-class'>" +
        b.classCode +
        "</span></td>" +
        "<td><span class='badge " +
        badgeClass +
        "'>" +
        b.status +
        "</span></td>" +
        "<td>₹" +
        b.amount.toFixed(0) +
        "</td>" +
        "<td>" +
        (b.status === "CANCELLED"
          ? ""
          : "<button class='ghost-btn' data-cancel-pnr='" +
            b.pnr +
            "'>Cancel</button>") +
        "</td>" +
        "</tr>";
    });
    bookingsBody.innerHTML = html;
  }

  bookingsBody.addEventListener("click", function (e) {
    if (e.target.matches("[data-cancel-pnr]")) {
      var pnr = e.target.getAttribute("data-cancel-pnr");
      cancelBooking(pnr);
    }
  });

  function cancelBooking(pnr) {
    var user = getCurrentUser();
    if (!user) return;
    var bookings = readFromStorage(STORAGE_BOOKINGS);
    var booking = bookings.find(function (b) {
      return b.pnr === pnr && b.userEmail === user.email;
    });
    if (!booking) {
      alert("Booking not found.");
      return;
    }
    if (booking.status === "CANCELLED") {
      alert("Booking already cancelled.");
      return;
    }
    var users = readFromStorage(STORAGE_USERS);
    var fullUser = users.find(function (u) {
      return u.email === user.email;
    });
    if (!fullUser) return;
    var refund = Math.round(booking.amount * 0.8);
    booking.status = "CANCELLED";
    fullUser.wallet += refund;
    writeToStorage(STORAGE_BOOKINGS, bookings);
    writeToStorage(STORAGE_USERS, users);
    renderBookingsTable();
    updateWalletDisplay();
    refreshDashboard();
    alert("Booking cancelled. Refund: ₹" + refund.toFixed(0));
  }

  pnrForm.addEventListener("submit", function (e) {
    e.preventDefault();
    pnrMessage.textContent = "";
    pnrMessage.className = "inline-message";
    pnrDetailsCard.classList.add("hidden");
    pnrDetails.innerHTML = "";
    var pnrVal = pnrInput.value.trim();
    if (!pnrVal) {
      pnrMessage.textContent = "Please enter a PNR.";
      pnrMessage.classList.add("error");
      return;
    }
    var bookings = readFromStorage(STORAGE_BOOKINGS);
    var booking = bookings.find(function (b) {
      return b.pnr === pnrVal;
    });
    if (!booking) {
      pnrMessage.textContent = "No booking found for this PNR.";
      pnrMessage.classList.add("error");
      return;
    }
    pnrMessage.textContent = "PNR found.";
    pnrMessage.classList.add("success");
    var badgeClass = "badge-status-confirmed";
    if (booking.status === "WL") badgeClass = "badge-status-wl";
    if (booking.status === "CANCELLED") badgeClass = "badge-status-cancelled";
    var html =
      "<div class='detail-item'><div class='detail-label'>PNR</div><div class='detail-value'>" +
      booking.pnr +
      "</div></div>" +
      "<div class='detail-item'><div class='detail-label'>Passenger</div><div class='detail-value'>" +
      booking.passenger.name +
      " (" +
      booking.passenger.age +
      ", " +
      booking.passenger.gender +
      ")</div></div>" +
      "<div class='detail-item'><div class='detail-label'>Train</div><div class='detail-value'>" +
      booking.trainId +
      " - " +
      booking.trainName +
      "</div></div>" +
      "<div class='detail-item'><div class='detail-label'>Journey</div><div class='detail-value'>" +
      booking.from +
      " → " +
      booking.to +
      " on " +
      formatDateString(booking.date) +
      "</div></div>" +
      "<div class='detail-item'><div class='detail-label'>Class / Quota</div><div class='detail-value'><span class='badge badge-class'>" +
      booking.classCode +
      "</span> <span class='badge badge-quota'>" +
      booking.quota +
      "</span></div></div>" +
      "<div class='detail-item'><div class='detail-label'>Status</div><div class='detail-value'><span class='badge " +
      badgeClass +
      "'>" +
      booking.status +
      "</span></div></div>" +
      "<div class='detail-item'><div class='detail-label'>Fare Paid</div><div class='detail-value'>₹" +
      booking.amount.toFixed(0) +
      "</div></div>";
    pnrDetails.innerHTML = html;
    pnrDetailsCard.classList.remove("hidden");
  });

  function renderScheduleTable() {
    var filter = scheduleFilter.value.trim().toLowerCase();
    var html = "";
    trains.forEach(function (t) {
      var match =
        !filter ||
        t.from.toLowerCase().indexOf(filter) !== -1 ||
        t.to.toLowerCase().indexOf(filter) !== -1;
      if (!match) return;
      var classList = t.classes
        .map(function (c) {
          return c.code;
        })
        .join(", ");
      html +=
        "<tr>" +
        "<td>" +
        t.id +
        "</td>" +
        "<td>" +
        t.name +
        "</td>" +
        "<td>" +
        t.from +
        "</td>" +
        "<td>" +
        t.to +
        "</td>" +
        "<td>" +
        t.departure +
        "</td>" +
        "<td>" +
        t.arrival +
        "</td>" +
        "<td>" +
        classList +
        "</td>" +
        "</tr>";
    });
    if (!html) {
      html =
        "<tr><td colspan='7' class='placeholder'>No trains match this filter.</td></tr>";
    }
    scheduleBody.innerHTML = html;
  }

  scheduleForm.addEventListener("submit", function (e) {
    e.preventDefault();
    renderScheduleTable();
  });

  function renderProfile() {
    var user = getCurrentUser();
    if (!user) return;
    var users = readFromStorage(STORAGE_USERS);
    var fullUser = users.find(function (u) {
      return u.email === user.email;
    });
    if (!fullUser) return;
    var created = fullUser.createdAt
      ? new Date(fullUser.createdAt).toLocaleDateString()
      : "-";
    var html =
      "<div class='detail-item'><div class='detail-label'>Name</div><div class='detail-value'>" +
      fullUser.name +
      "</div></div>" +
      "<div class='detail-item'><div class='detail-label'>Email</div><div class='detail-value'>" +
      fullUser.email +
      "</div></div>" +
      "<div class='detail-item'><div class='detail-label'>Wallet Balance</div><div class='detail-value'>₹" +
      fullUser.wallet.toFixed(0) +
      "</div></div>" +
      "<div class='detail-item'><div class='detail-label'>Member Since</div><div class='detail-value'>" +
      created +
      "</div></div>";
    profileDetails.innerHTML = html;
  }

  passwordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    passwordMessage.textContent = "";
    passwordMessage.className = "inline-message";
    var user = getCurrentUser();
    if (!user) return;
    var curr = currentPassword.value;
    var next = newPassword.value;
    var users = readFromStorage(STORAGE_USERS);
    var fullUser = users.find(function (u) {
      return u.email === user.email;
    });
    if (!fullUser) return;
    if (fullUser.password !== curr) {
      passwordMessage.textContent = "Current password is incorrect.";
      passwordMessage.classList.add("error");
      return;
    }
    if (!next || next.length < 4) {
      passwordMessage.textContent = "New password must be at least 4 characters.";
      passwordMessage.classList.add("error");
      return;
    }
    fullUser.password = next;
    writeToStorage(STORAGE_USERS, users);
    passwordMessage.textContent = "Password updated successfully.";
    passwordMessage.classList.add("success");
    passwordForm.reset();
  });

  if (walletAddForm) {
    walletAddForm.addEventListener("submit", function (e) {
      e.preventDefault();
      walletAddMessage.textContent = "";
      walletAddMessage.className = "inline-message";
      var user = getCurrentUser();
      if (!user) {
        walletAddMessage.textContent = "Please login again.";
        walletAddMessage.classList.add("error");
        return;
      }
      var amount = parseFloat(walletAddAmount.value || "0");
      if (isNaN(amount) || amount <= 0) {
        walletAddMessage.textContent = "Enter a valid amount.";
        walletAddMessage.classList.add("error");
        return;
      }
      var users = readFromStorage(STORAGE_USERS);
      var fullUser = users.find(function (u) {
        return u.email === user.email;
      });
      if (!fullUser) {
        walletAddMessage.textContent = "User not found.";
        walletAddMessage.classList.add("error");
        return;
      }
      fullUser.wallet += amount;
      writeToStorage(STORAGE_USERS, users);
      walletAddMessage.textContent = "Amount added successfully.";
      walletAddMessage.classList.add("success");
      walletAddForm.reset();
      updateWalletDisplay();
      renderProfile();
      refreshDashboard();
    });
  }

  var currentUser = getCurrentUser();
  if (currentUser) {
    setNavVisible(true);
    switchPage("home-page");
    refreshDashboard();
  } else {
    setNavVisible(false);
    switchPage("login-page");
  }
  var today = new Date().toISOString().split("T")[0];
  if (journeyDate) journeyDate.value = today;
  renderScheduleTable();
});

