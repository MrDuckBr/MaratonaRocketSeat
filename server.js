//configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos extras/estaticos     //renderiza css
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({extended:true}))

//configurar a conexao com o banco de dados
const Pool = require("pg").Pool
const db = new Pool({
    user:'postgres',
    password:'1234',
    host: 'localhost',
    port:5432,
    database:'doe'
})

//configurando a template engine //jeito inteligente de trabalhar com html
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express:server,
    noCache:true,
})//ja entende que a pasta e a raiz



//configurar apresentacao da pagina
server.get("/",function(req,res){ // req = requisicoes e res = resposta
    db.query("SELECT * FROM donors",function(err,result){
        if(err) return res.send("Erro de bando de dados.")
        
        const donors = result.rows
        return res.render("index.html",{ donors})
    })
    
})

server.post("/",function(req,res){// para pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == ""|| blood ==""){
        return res.send("Todos os campos sao obrigatorios")
    }

     // coloca valores dentro do banco de dados
    const query =`
        INSERT INTO donors("name","email","blood")
         VALUES($1,$2,$3)`
    const values = [name,email,blood]

    db.query(query,values,function(err){
        if(err) return res.send("Erro no banco de dados")

        return res.redirect("/")
    })  
})

//ligar o server e permitir o acesso na porta 3000
server.listen(3000,function(){
    console.log("Iniciando server......")
    console.log("Server iniciado.")
    
})