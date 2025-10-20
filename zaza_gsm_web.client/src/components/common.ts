export function runChecksAndShowErrors(... checkCallbacks: Array<() => [HTMLDivElement, string] | [HTMLDivElement, string[]] | HTMLDivElement>)
{
    checkCallbacks.forEach(callback => {
        const result = callback();
        if (Array.isArray(result))
        {
            const [section, message] = result;
            if (Array.isArray(message))
                handleErrorMessagesIn(section, message);
            else
                handleErrorMessageIn((section), message);
        }
        else
            handleErrorMessageIn(result);
    });
}

function handleErrorMessageIn(section: HTMLDivElement, ... message: string[]) {
    handleErrorMessagesIn(section, message);
}
function handleErrorMessagesIn(section: HTMLDivElement, message: string[]): void {
    // Hide and destroy old messages
    const messages = section.querySelectorAll(".errorMessage") as NodeListOf<HTMLParagraphElement>;
    messages.forEach(msg => {
        hideErrorMessage(msg);
        setTimeout(() => {
            section.removeChild(msg);
        }, 500);
    });

    // Create and show new messages
    let delay = (messages.length == 0) ? 0 : 500;
    setTimeout(() => {
        message.forEach(msg => {
            const newP = document.createElement("p");
            newP.className = "errorMessage transition-[height,opacity] duration-500 h-0 opacity-0 hidden text-sm text-red-500";
            newP.textContent = msg;
            section.insertBefore(newP, section.firstChild);
            showErrorMessage(newP);
        });
    }, delay);
}

function showErrorMessage(messageElement: HTMLParagraphElement): void {
    const section = messageElement.parentElement as HTMLDivElement;
    if (section === null)
    {
        console.debug(`section is null in showErrorMessage(${messageElement})`);
        return;
    }
    // originalMessageElements already contains the argument messageElement.
    const originalMessageElements = section.querySelectorAll(".errorMessage") as NodeListOf<HTMLParagraphElement>;
    const originalHeight = 66 + (originalMessageElements.length - 1) * 20;
    const nextHeight = originalHeight + 20;
    
    messageElement.classList.remove("hidden");
    void messageElement.offsetHeight; // Force reflow
    requestAnimationFrame(() => {
        section.classList.replace(`h-[${originalHeight}px]`, `h-[${nextHeight}px]`);
        messageElement.classList.replace("h-0", "h-[20px]");
        messageElement.classList.replace("opacity-0", "opacity-100");
    });
}

function hideErrorMessage(messageElement: HTMLParagraphElement): void {
    const section = messageElement.parentElement as HTMLDivElement;
    
    if (section === null)
    {
        console.debug(`section is null in hideErrorMessage(${messageElement})`);
        return;
    }
    const originalMessageElements = section.querySelectorAll(".errorMessage") as NodeListOf<HTMLParagraphElement>;
    const originalHeight = 66 + originalMessageElements.length * 20;
    const nextHeight = originalHeight - 20;

    messageElement.classList.replace(`h-[20px]`, `h-0`);
    messageElement.classList.replace("opacity-100", "opacity-0");
    setTimeout(() => {
        section.classList.replace(`h-[${originalHeight}px]`, `h-[${nextHeight}px]`);
        messageElement.classList.add("hidden");
    }, 500);
}