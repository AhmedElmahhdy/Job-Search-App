// import nodemailer from "nodemailer"



// export const sendEmail = async ({email='',text='',subject='',from=''}={}) => {
//     const transporter = nodemailer.createTransport({
//         host: "localhost",
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });

//     const mailOptions = {
//         from:from ,
//         to: email,
//         subject: subject,
//         html: text
//     }
//     return await transporter.sendMail(mailOptions)
// }
    



import nodemailer from "nodemailer"


export const sendEmailService = async({to = "", subject = "", text = "",from=""}={}) => {
    const transporter = nodemailer.createTransport({
        host:"localhost",
        port:587 , 
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        },
        service:"gmail",
    })

   const emailInfo = await transporter.sendMail({
        from:from,
        to,
        subject,
        html:text

    })

    return emailInfo;

};