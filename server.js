 const json2html = require('node-json2html');
 const puppeteer = require('puppeteer');
const Express = require('express');
const app = Express();
const fs = require('fs-extra');
app.use(Express.static('public'));
app.use('/css',Express.static(__dirname+'public/css'));


//L'objet json
let Report = {
        "bands": {
          "format":"A3",
          "Header1":{  
        "Type": "Report Header",
        "Content":{
    "Compoments": {
            "1":{"id":"","Ref":"","type": "Img","value":"CompanyName","style":"max-height:48px;height:48px;padding:0px 0px 0px 2px;width:344px;max-width:346px;","classe":"", "positions":""},
            "2":{"id":"","Ref":"","type":"Image","URI":"","value":"CompanyAdresse","style":"width:275px;padding:0px 0px 0px 3px;height:19px;max-width:278px;max-height:19px;","classe":"","positions":""},       // tous les composants de rapport 
            "3":{"id":"","Ref":"","type": "text","value":"CompanyZipCode","style":"border:0px;height:10px;width:29px;","classe":"","positions":""},  
            "4":{"id":"","Ref":"","type": "text","value":"CompanyCountry","style":"width:275px;padding:0px 0px 0px 3px;height:19px;max-width:278px;max-height:19px;","classe":"","positions":""},  
            "5":{"id":"","Ref":"","type": "Img","value":"CompanyCountry","style":"width:275px;padding:0px 0px 0px 3px;height:19px;max-width:278px;max-height:19px;","classe":"","positions":""},  
            "6":{"id":"","Ref":"","type":"Img","URI":"https://c0.klipartz.com/pngpicture/807/280/gratis-png-logotipo-de-marketing-en-redes-sociales-pequena-empresa-venta-flash.png","style":"width:275px;padding:0px 0px 0px 3px;height:19px;max-width:278px;max-height:19px;","classe":"","positions":""},
          },
        },
      },
      "Header2": {
        "Type": "Page Header",
        "Content":{
          "Compoments": {
            "1":{"id":"","Ref":"","type": "text","value":"Description","style":"max-height:48px;height:48px;padding:0px 0px 0px 2px;width:344px;max-width:346px;","classe":"", "positions":""},
            "2":{"id":"","Ref":"","type":"text","value":"Quantité","style":"width:275px;padding:0px 0px 0px 3px;height:19px;max-width:278px;max-height:19px;","classe":"","positions":""},
            "3":{"id":"","Ref":"","type": "text","value":"Prix Unistaire","style":"max-height:48px;height:48px;padding:0px 0px 0px 2px;width:344px;max-width:346px;","classe":"", "positions":""},
            "4":{"id":"","Ref":"","type":"text","URI":"","value":"Montant","style":"width:275px;padding:0px 0px 0px 3px;height:19px;max-width:278px;max-height:19px;","classe":"","positions":""},
            },
            

          "dataSource": [   //  data in datasource
            "Description",
            "Quantité",
            "Prix Unistaire",
            "Montant",
            "quelque description",
            "quelque Quantité",
             "quelque prix",
             "quelque Montant"
          ],
          "style": "border-width:0px;width:719px;border-collapse:collapse;"
      },

      
    },
                       
      "Footer1": {                // cette section se trouve dans une seul page 
        "Type": "Footer Table",
         "Content": {
           "Compoments" :{
            "1":{"id":"","Ref":"","type":"text","value":"Totale TVA","style":"margin-left:700px;","classe":"", "positions":""},
            "2":{"id":"","Ref":"","type":"text","value":"Totale Price","style":"margin-left:700px;","classe":"","positions":""},
           },
               },     
                  },
      "Footer2": {                // cette section se repet chaque page 
        "Type": "Footer page",
        "Contenu": "Page 1 sur 1",
        "style":"text-align:center"
      },
    }
  }


  function editTable(){
 if(Report.bands.format=='A4'){
 console.log('A4 format')
} else {
    console.log(Report.bands.format);
   }
   
 

  }
  /////////**fin objet json */

      // Pour simplifier le chose 

      // Header 1 pour l'entete de page (companyName,.....)
       
      // Header 2 les columns de Tableau (le th de tableau, et le data source importé de base )

      // Footer 1 est le reultat quelconque

      // Foter 2 est pied de page (la numerotation ....)
      

        let template_entete_header1 ={

          "<>": "tr", "html": [
            {"<>": "th", "html": Report.bands.Header1.Content.Compoments[1].value},
            {"<>": "tr" },
            {"<>": "td", "html":Report.bands.Header1.Content.Compoments[2].value },
            {"<>": "tr" },
            {"<>": "td", "html": Report.bands.Header1.Content.Compoments[3].value},
            {"<>": "tr" },
            {"<>": "td", "html":Report.bands.Header1.Content.Compoments[4].value},   
            {"<>": "tr" },
            {'<>':'img','alt':'this is our logo','width':'40', 'height':'34','src':''+Report.bands.Header1.Content.Compoments[6].URI},
           
            
                          ]
          }


              let template_table_header = {   //le th de tableau
                      "<>": "tr", "html": [
                          {"<>": "th", "html": Report.bands.Header2.Content.Compoments[1].value},
                          {"<>": "th", "html": Report.bands.Header2.Content.Compoments[2].value},
                          {"<>": "th", "html": Report.bands.Header2.Content.Compoments[3].value},
                          {"<>": "th", "html": Report.bands.Header2.Content.Compoments[4].value}
                          
                      ]
                  }

      let template_table_body = {
        "<>": "tr", "html": [
          {"<>": "td", "html": Report.bands.Header2.Content.dataSource[0]},
          {"<>": "td", "html": Report.bands.Header2.Content.dataSource[1]},
          {"<>": "td", "html": Report.bands.Header2.Content.dataSource[2]},
          {"<>": "td", "html":Report.bands.Header2.Content.dataSource[3]},
                    ]             
               
          
               
  }
     
      let template_Footer = {
        "<>":"div", "html":[
          { '<>':'div','style':''+Report.bands.Footer1.Content.Compoments[1].style ,"html":''+Report.bands.Footer1.Content.Compoments[1].value+''},
          { '<>':'div','style':''+Report.bands.Footer1.Content.Compoments[2].style ,"html":''+Report.bands.Footer1.Content.Compoments[2].value+''},
         
               ] 

      }


  // let template_page_Footer2 = {
  //      "html": [
  //         {"html": Report.bands.Footer2.Contenu},
                    
  //     ]
  // }


  let template_page_Footer2 = {'<>':'div','html':[
    {'<>':'span','style':''+Report.bands.Footer2.style ,'html':''+Report.bands.Footer2.Contenu},
  
]} 




  // program to generate random strings


    //const result = Math.random().toString(36).substring(2,7); //generer une chaine quelconque


  writeHtmlFromScoresJson(Report,'test.html');
  
  function writeHtmlFromScoresJson(jsonFile, htmlTableFile) {

    let data = jsonFile;
      

    //convertir json to html 
    let entetepage = json2html.transform(data,template_entete_header1);
    let table_header = json2html.transform(data, template_table_header);
    let table_body = json2html.transform(data, template_table_body);
    let footer1 = json2html.transform(data, template_Footer);
    let footer2 = json2html.transform(data, template_page_Footer2); 

  //integrer les element html 

    let entetPage = '<div class="book"><table>' + entetepage +'</table></div>'

    let header = '<!DOCTYPE html>' + '<html lang="en">\n<head> <title>My Report</title></head>'     
    
   // let body ='<div>'+entetPage+'<table class="subpage" border="1px" style="width:100%">\n'+ table_header + '\n'+ table_body +table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+'<br></table></div>'

    let contenu_table = entetPage+'<div><table border="1px" class=table_contenu>\n'+ table_header + '\n'+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+table_body+'</table></div>'

     // let footer3 = '<div id =footerpage>'+footer2+'</div>'
    //let footer = '<div>'+footer1+'</div>'
    contenu_table1 ='<body class="'+Report.bands.format+' landscape"> <section class="sheet padding-5mm">'+ contenu_table +'<div> <p> on va ecrire qquelque chode ici pour controler la pagination des pages </p></div>'+footer1+'</section></body>'
  
  let html = header+contenu_table1+'\n\n</html>';

     fs.writeFile(htmlTableFile, html, (err) => {
          if (err) throw err;
           else console.log('file html created');
    
          });

              (async () => {
            // // launch a new chrome instance
              const browser = await puppeteer.launch({
                  headless: true,
                   
               })
               const templateHeader = fs.readFileSync('test.html', 'utf-8')
            // //   // create a new page
               const page = await browser.newPage()
            
            // //   // set your html as the pages content
                const html = fs.readFileSync(`${__dirname}/test.html`, 'utf8')
               await page.setContent(html, {
                 
                })
                             
               await page.addStyleTag({content: ' @page { size: A4 }'})
              await page.addStyleTag({path: 'style.css'})
            await page.pdf({
             path: 'test.pdf',
             format: Report.bands.format,
              displayHeaderFooter: true,
              headerTemplate: templateHeader,
              
                        }), 
              
             console.log('Pdf File created') 
              //close the browser
               await browser.close()
               let port = 3000;

              app.listen(port, () => {
                console.log(` we are  listening in PORT ${port}`)
                console.log('our format is '+Report.bands.format);
              })
              })()
              
              editTable();
}



