export async function getCaptchaToken() {
    
    return new Promise<string | null>((resolve) => {
        grecaptcha.ready( async () => {
            const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
            if (!siteKey) {
                resolve(null);
                return;
            }

            const token = await grecaptcha.execute(siteKey, { action: "submit" });
            resolve(token);
        });
    });
}


export async function verifyCaptchaToken(token: string) {

    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
        throw new Error("RECAPTCHA_SECRET_KEY is not set");
    }

    const url = new URL("https://www.google.com/recaptcha/api/siteverify")
    url.searchParams.append("secret", secret);
    url.searchParams.append("response", token);

    const res = await fetch(url, { method: "POST" });
    const captchaData: CaptchaData = await res.json();
    console.log("CAPTCHA DATA",captchaData);

    if (!res.ok) {
        return null;
    }

    return captchaData;

}

type CaptchaData = {
    success: true;
    challenge_ts: string;
    hostname: string;
    score: number;
    action: string;
} | {
    success: false;
    "error-codes": string[];
};