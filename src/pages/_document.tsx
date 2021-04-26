import Document, {Html, Head, Main, NextScript} from 'next/document'

//Por enquanto só suporta ser escrito no formato de classe
export default class MyDocument extends Document{
    // Configuração padrão usada no Next:
    render(){
        return(
            <Html>
                <Head>
                    {/* Importando fonts */}
                    <link rel="preconnect" href="https://fonts.gstatic.com"/>
                    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet"/>

                    <link rel="shortcut icon" href="/favicon.png" type="image/png"/>
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        )
    }
}