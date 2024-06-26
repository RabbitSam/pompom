export default function showGenericErrorPopup() {
    const event = new CustomEvent("show-popup", {
        detail: {
            type: "error",
            message: "An unexpected error occured. Please refresh to try again."
        }
    });

    window.dispatchEvent(event);
}