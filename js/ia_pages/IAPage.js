(function(env) {


    // placeholder

    DDH.IAPage = function(ops) {
        this.init(ops); 
    };

    // this could get the single IA json like the index.
    // but for now the page is being built with xslate
    DDH.IAPage.prototype = {
        init: function(ops) {
            console.log("IAPage.init()\n"); 

            if (DDH_iaid) {
                console.log("for ia id '%s'", DDH_iaid);

                $.getJSON("/ia/view/" + DDH_iaid + "/json", function(x) {
                    var field_order = [
                        'name',
                        'status',
                        'description',
                        'team',
                        'topic',
                        'screens',
                        'examples',
                        'related',
                        'devinfo',
                        'issues'
                    ];

                    // Readonly mode templates
                    var readonly_templates = {
                        name : Handlebars.templates.name(x),
                        status : Handlebars.templates.status(x),
                        description : Handlebars.templates.description(x),
                        team : Handlebars.templates.team(x),
                        topic : Handlebars.templates.topic(x),
                        screens : Handlebars.templates.screens(x),
                        examples : Handlebars.templates.examples(x),
                        related : Handlebars.templates.related(x),
                        devinfo : Handlebars.templates.devinfo(x),
                        issues : Handlebars.templates.issues(x),
                    };

                    // Pre-Edit mode templates
                    var pre_templates = {
                        name : Handlebars.templates.pre_edit_name(x),
                        status : Handlebars.templates.pre_edit_status(x),
                        description : Handlebars.templates.pre_edit_description(x),
                        team : Handlebars.templates.pre_edit_team(x),
                        topic : Handlebars.templates.pre_edit_topic(x),
                        screens : Handlebars.templates.screens(x),
                        examples : Handlebars.templates.pre_edit_examples(x),
                        related : Handlebars.templates.pre_edit_related(x),
                        devinfo : Handlebars.templates.devinfo(x),
                        issues : Handlebars.templates.pre_edit_issues(x)
                    };

                    function updateAll(templates) {
                        $(".ia-single").empty();
                        for (var i = 0; i < field_order.length; i++) {
                            $(".ia-single").append(templates[field_order[i]]);
                        }
                    }

                    updateAll(readonly_templates);

                    $("body").on('click', '.ia-single .dev-info', DDH.IAPage.prototype.expand.bind(this));

                    $("#edit_activate").on('click', function(evt) {
                        updateAll(pre_templates);

                        $("#edit_disable").removeClass("hide");
                        $(this).hide();
                    });

                    $("body").on('mouseenter mouseleave', '.pre_edit', function(evt) {
                        $(this).toggleClass("highlight");
                    });

                    $("body").on('click', '.pre_edit', function(evt) {
                        var name = $(this).attr('name');
                        var $obj;

                        if (name === "example_query" || name === "other_queries") {
                           $obj = $("#examples");
                           name = "examples";
                        } else if (name === "topic") {
                            $obj = $("#topics");
                        } else if (name === "code") {
                            $obj = $(".dev-info-details");
                        }else {
                            $obj = $(this);
                        }

                        $obj.replaceWith(Handlebars.templates['edit_' + name](x));

                        if (name === "examples") {
                            if (!($("#examples .other-examples").length)) {
                                $("#primary").parent().find(".button.delete").addClass("hide");
                            }
                        }
                    });

                    $("#edit_disable").on('click', function(evt) {
                        location.reload();
                    });

                    $("body").on('click', '#add_example', function(evt) {
                        $(this).addClass("hide");
                        $("#input_example").removeClass("hide");
                    });

                    $("body").on('focusout keypress', '.editable input', function(evt) {
                        if (evt.type === 'focusout' || (evt.type === 'keypress' && evt.which === 13)) {
                            var $obj = $(this).parent();
                            var field = $obj.attr('name');
                            var value = $(this).val();

                            if ($obj.attr('id') === 'input_example') {
                                if (value !== '') {
                                    $obj.parent().before('<li class="editpage"><div class="button delete listbutton"><span>-</span></div>' +
                                                   '<span class="editable other-examples newentry" name="other_queries" title="Try this example on DuckDuckGo">' +
                                                   '<input type="text" value="' + value + '" /></span></li>');
                                }

                                $(this).val("");
                                $obj.addClass("hide");
                                $("#add_example").removeClass("hide");

                                var $primary_button = $("#primary").parent().parent().find(".button.delete");
                                if ($primary_button.hasClass("hide")) {
                                    $primary_button.removeClass("hide");
                                }
                            }

                            if (field !== "topic" && field !== "other_queries" && field !== "code" && field !== "example_query") {
                                save(field, value, DDH_iaid, $obj, true);
                            }

                            if (evt.type === "keypress") {
                                return false;
                            }
                        }
                    });

                    $("body").on("click", ".button.delete", function(evt) {
                        var field = $(this).parent().find("a.editable").attr('name');
                        var value;
                        var $obj = $("#examples");

                        console.log("Field: " + field);
                        if (field === 'example_query') {
                            var $new_primary = $('a.other-examples input').first();
                            if ($new_primary.length) {
                                $new_primary.parent().removeClass('other-examples');
                                $new_primary.parent().attr('name', 'example_query');
                                $new_primary.parent().attr('id', 'primary');
                            }
                        }

                        $(this).parent().remove();

                        if (!$("#examples .other-examples").length && $("#primary").length) {
                            $("#primary").parent().find(".button.delete").addClass("hide");
                        }
                    });

                    $("body").on("click", ".section_editable .button.end", function(evt) {
                        var $obj = $(this).parent();
                        var field = $obj.attr('id');
                        var value = [];
                        var selector;

                        if (field === "topic") {
                            selector = ".ia_topic a.editable input";
                        } else if (field === "examples") {
                            save("example_query", $("#primary input").val(), DDH_iaid, $obj, false);
                            field = "other_queries";
                            selector = "#examples .other-examples input";
                        } else {
                            selector = "li.code.editable input";
                            $obj = $(".dev-info-details");
                        }

                        $(selector).each(function(index) {
                            if ($(this).val()) {
                                value.push($(this).val());
                            }
                        });

                        value = JSON.stringify(value);
                        save(field, value, DDH_iaid, $obj, true);
                    });

                    function save(field, value, id, $obj, replace) {
                        var jqxhr = $.post("/ia/save", {
                            field : field, 
                            value : value,
                            id : id
                        })
                        .done(function(data) {
                            if (!data.result) {
                                if ($("#error").hasClass("hide")) {
                                    $("#error").removeClass("hide");
                                }
                            } else {
                                var name;
                                if (field === "example_query" || field === "other_queries") {
                                    name = "examples";
                                } else {
                                    name = field;
                                }

                                if (field === "other_queries" || field === "topic" || field === "code") {
                                    x[field] = $.parseJSON(data.result[field]);
                                } else {
                                    x[field] = data.result[field];
                                }

                                pre_templates[field] = Handlebars.templates['pre_edit_' + name](x);

                                if (replace) {
                                    $obj.replaceWith(pre_templates[field]);
                                }
                            }
                        });
                    }
                });
            }
        },

        expand: function() {
            $(".ia-single .dev-info").addClass("hide");
            $(".ia-single .dev-info-details").removeClass("hide");
        }        
    };

})(DDH);
