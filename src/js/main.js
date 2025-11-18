/* ========== FANCYBOX ========== */
Fancybox.bind("[data-fancybox]", {});
/* ========== END FANCYBOX ========== */

/* ========== IMASK ========== */
const element = document.querySelector("*[data-imask]");
const maskOptions = {
  mask: "+{7} (000) 000-00-00",
};
const mask = IMask(element, maskOptions);
/* ========== END IMASK ========== */

/* ========== MODAL LOGIC ========== */
function modal() {
  let btnOpenModal = document.querySelectorAll("*[data-modal-open]");
  const btnCloseModal = document.querySelectorAll("*[data-modal-close]");
  const btnBlockModal = document.querySelectorAll("*[data-modal-block]");
  const modals = document.querySelectorAll(".modal-wrapper");

  btnOpenModal.forEach((btn) => {
    btn.addEventListener("click", toggleModalClass);
  });
  btnCloseModal.forEach((btn) => {
    btn.addEventListener("click", toggleModalClass);
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      console.log(e.target.className);
      if (e.target.className.includes("modal-wrapper")) {
        modal.classList.remove("active");
      }
    });
  });

  function toggleModalClass() {
    btnBlockModal.forEach((block) => {
      if (
        this.dataset.modalOpen === block.dataset.modalBlock ||
        this.dataset.modalClose === block.dataset.modalBlock
      ) {
        block.classList.toggle("active");
        this.classList.toggle("active");
      }
    });
  }
}
modal();
/* ========== END MODAL LOGIC ========== */

/* ========== PLAY AUDIO ========== */
function playAudio() {
  document.addEventListener("click", function (e) {
    const audioBtn = e.target.closest("*[data-audio-btn]");
    if (!audioBtn) return;

    const audioBlock = audioBtn.closest("*[data-audio]");
    const audioTrack = audioBlock.querySelector("*[data-audio-track]");
    console.log(audioBlock, audioBtn, audioTrack);

    if (audioTrack.paused) {
      audioBlock.classList.add("active");
      audioTrack.currentTime = 0;
      audioTrack.play();
    } else {
      audioBlock.classList.remove("active");
      audioTrack.pause();
    }

    audioTrack.addEventListener(
      "ended",
      function () {
        audioBlock.classList.remove("active");
      },
      { once: true },
    );
  });
}
playAudio();
/* ========== END PLAY AUDIO ========== */
