this.Handlebars=this.Handlebars||{},this.Handlebars.templates=this.Handlebars.templates||{},this.Handlebars.templates.index=Handlebars.template(function(a,b,c,d,e){function f(a,b){var d,e,f="";return f+='\n<tr>\n\n    <td style="width:2em; text-align:right; padding-right:1em;">\n        '+k((d=null==b||b===!1?b:b.index,typeof d===j?d.apply(a):d))+'\n    </td>\n\n    <td>\n        <a href="/ia/view/',(e=c.id)?d=e.call(a,{hash:{},data:b}):(e=a&&a.id,d=typeof e===j?e.call(a,{hash:{},data:b}):e),f+=k(d)+'">',(e=c.name)?d=e.call(a,{hash:{},data:b}):(e=a&&a.name,d=typeof e===j?e.call(a,{hash:{},data:b}):e),f+=k(d)+"</a>\n    </td>\n\n    <td>\n        ",(e=c.description)?d=e.call(a,{hash:{},data:b}):(e=a&&a.description,d=typeof e===j?e.call(a,{hash:{},data:b}):e),f+=k(d)+'\n    </td>\n    <td class="ia_src_column">\n        ',(e=c.src_name)?d=e.call(a,{hash:{},data:b}):(e=a&&a.src_name,d=typeof e===j?e.call(a,{hash:{},data:b}):e),f+=k(d)+"\n    </td>\n\n    <td>\n        ",d=c.each.call(a,a&&a.topic,{hash:{},inverse:l.noop,fn:l.program(2,g,b),data:b}),(d||0===d)&&(f+=d),f+='\n    </td>\n\n    <td style="padding-right: 1em">\n        ',(e=c.dev_milestone)?d=e.call(a,{hash:{},data:b}):(e=a&&a.dev_milestone,d=typeof e===j?e.call(a,{hash:{},data:b}):e),f+=k(d)+'\n    </td>\n\n    <td style="padding-right: 1em">\n        ',(e=c.repo)?d=e.call(a,{hash:{},data:b}):(e=a&&a.repo,d=typeof e===j?e.call(a,{hash:{},data:b}):e),f+=k(d)+"\n    </td>\n\n</tr>\n"}function g(a){var b="";return b+=' <span class="ia_topic">'+k(typeof a===j?a.apply(a):a)+"</span> "}this.compilerInfo=[4,">= 1.0.0"],c=this.merge(c,a.helpers),e=e||{};var h,i="",j="function",k=this.escapeExpression,l=this;return i+="\n\n",h=c.each.call(b,b&&b.ia,{hash:{},inverse:l.noop,fn:l.program(1,f,e),data:e}),(h||0===h)&&(i+=h),i+="\n"}),function(a){a.DDH={}}(window),function(){DDH.IAIndex=function(){this.init()},DDH.IAIndex.prototype={sort_field:"",sort_asc:1,init:function(){var a=this;$("#sort_name").on("click",DDH.IAIndex.prototype.sort.bind(this,"name")),$("#sort_descr").on("click",DDH.IAIndex.prototype.sort.bind(this,"description")),$("#sort_status").on("click",DDH.IAIndex.prototype.sort.bind(this,"dev_milestone")),$("#sort_repo").on("click",DDH.IAIndex.prototype.sort.bind(this,"repo")),$.getJSON("/ia/json",function(b){a.ia_list=b,a.sort("name")})},sort:function(a){this.sort_asc=this.sort_field==a?1-this.sort_asc:1,this.sort_field=a;var b=this.sort_asc;this.ia_list.sort(function(c,d){if(b)var e=c,f=d;else{var e=d;f=c}return e[a]>f[a]?1:e[a]<f[a]?-1:0}),this.refresh()},refresh:function(){var a=Handlebars.templates.index({ia:this.ia_list});$("#ia_index").html(a)}}}(DDH),function(){DDH.IAPage=function(a){this.init(a)},DDH.IAPage.prototype={init:function(){}}}(DDH),$(document).ready(function(){DDH_iapage&&DDH[DDH_iapage]&&(DDH.page=new DDH[DDH_iapage])});