export default function showGenericErrorPopup() {
    const event = new CustomEvent("show-popup", {
        detail: {
            type: "error",
            message: "An unexpected error occured. Please go back and return to try again."
        }
    });

    window.dispatchEvent(event);
}