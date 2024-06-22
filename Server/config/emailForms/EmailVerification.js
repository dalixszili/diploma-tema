const EmailVerification = (url) => {
  return `
  <div style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="padding: 20px; text-align: center;">
            <h1 style="font-size: 24px; margin-bottom: 20px;">
            E-mail cím visszaigazolása
            </h1>
            <p style="font-size: 16px; margin-bottom: 30px;">
            Köszönjük regisztrálását a TDK honlapjára. Kérjük erősítse meg e-mail címét az alábbi linken ! 
            </p>
            <a href="${url}" style="display: inline-block; padding: 15px 25px; font-size: 16px; color: #ffffff; background-color: #06f48f; text-decoration: none; border-radius: 5px;">
            Visszaigazolás
            </a>
        </div>
    </div>    
  `;
};
export default EmailVerification;
