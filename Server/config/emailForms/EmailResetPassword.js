const EmailResetPassword = (name, url) => {
  return `
  <div style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="padding: 20px; text-align: center;">
            <h1 style="font-size: 24px; margin-bottom: 20px;">
            Jelszó visszaállítása
            </h1>
            <p style="font-size: 16px; margin-bottom: 30px;">
            Kedves ${name}, <br><br> &ensp;
              Elfelejtette a jelszavát ? <br>
              Új jelszó beállításához kérjük használja az alábbi linket . 
            </p>
            <a href="${url}" style="display: inline-block; padding: 15px 25px; font-size: 16px; color: #ffffff; background-color: #06f48f; text-decoration: none; border-radius: 5px;">
            Jelszó visszaállítása 
            </a>
            <p style="padding: 20px 0; font-size: 12px; color: #888888;">
              Figyelem: A visszaállítás a kéréstől számított 12 órán belül érvényét veszti! <br>
              Ha mégsem szeretne új jelszót beállítani, akkor hagyja figyelmen kivül az üzenetet.  
            </p>
        </div>
    </div>    
  `;
};
export default EmailResetPassword;
