$(document).ready(function () {
  var animating = false;
  var cardsCounter = 0;
  var decisionVal = 80;
  var pullDeltaX = 0;
  var deg = 0;
  var $card, $cardReject, $cardLike;

  var options = [
    {
      name: "Option 1 Name",
      image: "../assets/images/kris_bryant.png"
    },
    {
      name: "Option 2 Name",
      image: "../assets/images/kris_bryant.png"
    },
    {
      name: "Option 3 Name",
      image: "../assets/images/kris_bryant.png"
    },
    {
      name: "Option 4 Name",
      image: "../assets/images/kris_bryant_2.jpg"
    },
    {
      name: "Option 4 Name",
      image: "../assets/images/kris_bryant_2.jpg"
    },
    {
      name: "Option 4 Name",
      image: "../assets/images/kris_bryant_2.jpg"
    },
  ];
  var numOfCards = options.length;
  for (let i = options.length - 1; i >= 0; i--) {
    var html = '';
    html += `
      <div class="card">
          <div class="card--top option_${i}"><img src="${options[i].image}"></div>
          <div class="card--btm">
              <p class="card--btm--label">${options[i].name}</p>
          </div>
          <div class="card--choice m--reject"><i class="fa-solid fa-thumbs-down fa-10x"></i></div>
          <div class="card--choice m--like"><i class="fa-solid fa-thumbs-up fa-10x"></i></div>
          <div class="card--drag"></div>
      </div>`
    $('.container').append(html);
  }

  function pullChange() {
    animating = true;
    deg = pullDeltaX / 10;
    $card.css(
      "transform",
      "translateX(" + pullDeltaX + "px) rotate(" + deg + "deg)"
    );

    var opacity = pullDeltaX / 100;
    var rejectOpacity = opacity >= 0 ? 0 : Math.abs(opacity);
    var likeOpacity = opacity <= 0 ? 0 : opacity;
    $cardReject.css("opacity", rejectOpacity);
    $cardLike.css("opacity", likeOpacity);
  }

  function release() {
    if (pullDeltaX >= decisionVal) {
      $card.addClass("to-right");
    } else if (pullDeltaX <= -decisionVal) {
      $card.addClass("to-left");
    }

    if (Math.abs(pullDeltaX) >= decisionVal) {
      $card.addClass("inactive");

      setTimeout(function () {
        $card.appendTo(".recap");
        if ($card.hasClass("to-right")) {
          $card.find(".card--btm").css("background", "#0be881");
        } else {
          $card.find(".card--btm").css("background", "#ff3f34");
        }

        cardsCounter++;
        if (cardsCounter === numOfCards) {
          cardsCounter = 0;
          $(".recap").toggleClass("hide", 400);
        }
      }, 300);
    }

    if (Math.abs(pullDeltaX) < decisionVal) {
      $card.addClass("reset");
    }

    setTimeout(function () {
      $card
        .attr("style", "")
        .removeClass("reset")
        .find(".card--choice")
        .attr("style", "");

      pullDeltaX = 0;
      animating = false;
    }, 300);
  }

  $(document).on(
    "mousedown touchstart",
    ".card:not(.inactive)",
    function (e) {
      if (animating) return;

      $card = $(this);
      $cardReject = $(".card--choice.m--reject", $card);
      $cardLike = $(".card--choice.m--like", $card);
      var startX = e.pageX || e.originalEvent.touches[0].pageX;

      $(document).on("mousemove touchmove", function (e) {
        var x = e.pageX || e.originalEvent.touches[0].pageX;
        pullDeltaX = x - startX;
        if (!pullDeltaX) return;
        pullChange();
      });

      $(document).on("mouseup touchend", function () {
        $(document).off("mousemove touchmove mouseup touchend");
        if (!pullDeltaX) return; // prevents from rapid click events
        release();
      });
    }
  );
});
