"use strict";

window.moodler = {

    _go: "",
    _diagram: "",


    /**
     * Init function, recieves an optional DIV Object
     * @param moodlerDiv
     */
    init: function (moodlerDiv) {
        if (typeof moodlerDiv === "undefined") {
            moodlerDiv = "moodlerDIV";
        }
        go.licenseKey = "54fe4ee3b01c28c702d95d76423d6cbc5cf07f21de8349a00a5042a3b95c6e172099bc2a01d68dc986ea5efa4e2dc8d8dc96397d914a0c3aee38d7d843eb81fdb53174b2440e128ca75420c691ae2ca2f87f23fb91e076a68f28d8f4b9a8c0985dbbf28741ca08b87b7d55370677ab19e2f98b7afd509e1a3f659db5eaeffa19fc6c25d49ff6478bee5977c1bbf2a3";
        this._go = go.GraphObject.make;
        /**
         * @var {go.Diagram}
         */
        this._diagram = this._go(go.Diagram, moodlerDiv, {
            //initialContentAlignment: go.Spot.Center, // center Diagram contents
            padding: new go.Margin(75, 5, 5, 5),
            "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
            model: new go.GraphLinksModel(),
            layout: this._go(go.ForceDirectedLayout,
                {
                    epsilonDistance: 8
                }),
            initialAutoScale: go.Diagram.Uniform
        });
        this._diagram.addDiagramListener("ObjectSingleClicked", checkNameEvent);
	    this._diagram.addDiagramListener("ObjectSingleClicked", checkRelationEvent); //Fehler heist errorRelation
        this._diagram.addModelChangedListener(function (evt) {
            if (evt.isTransactionFinished) {
                if (typeof(Storage) !== "undefined") {
                    var entityList = moodler._diagram.model.nodeDataArray;
                    if (entityList.length > 0)
                        localStorage.setItem("quicksave", evt.model.toJson())
                } else {
                    // Sorry! No Web Storage support..
                }
            }
        });
        window.PIXELRATIO = this._diagram.computePixelRatio();
        setupTemplates(this._go, this._diagram);
    },

    /**
     * Adds an Entity to the diagram in the x,y coordinates specified.
     * @entityData contains its name and properties.
     * @param x abscissa of the point where the entity is to be added to the diagram
     * @param y ordinate of the point where the entity is to be added to the diagram
     */
    addEntity: function (entityData, x, y) {
        var node = this._diagram.model.findNodeDataForKey(entityData.entityName);
        if (entityData.id !== undefined)
            notification.destroyToastForKey(entityData.id);


        this._diagram.startTransaction("Add/Edit Entity " + entityData.entityName);

        if (entityData.id !== undefined) {
            console.log(entityData.id);
                var entity = this._diagram.model.findNodeDataForKey(entityData.id);
                this._diagram.model.setDataProperty(entity, "properties", entityData.properties);
                this._diagram.model.setDataProperty(entity, "entityName", entityData.entityName);
        }
        else {
               if (x && y) {
                   this._diagram.model.addNodeData({
                       key: entityData.entityName,
                       entityName: entityData.entityName,
                       location: new go.Point(parseFloat(x), parseFloat(y)),
                       properties: entityData.properties,
                       category: "entity"
                   });
               } else {
                   this._diagram.model.addNodeData({
                       key: entityData.entityName,
                       entityName: entityData.entityName,
                       properties: entityData.properties,
                       category: "entity"
                   });
               }
            suggestEntityAndRelation(entityData);
            suggestGeneralSpecial(entityData);
        }
        this._diagram.commitTransaction("Add/Edit Entity " + entityData.entityName);
    },

    addEntityNoGeneralSuggest: function (entityData, x, y) {
        var node = this._diagram.model.findNodeDataForKey(entityData.entityName);
        // if (node !== null) {
        //         notification.createError("Fehler", "A Entity with this name already exists.");
        //         throw new Error("A Entity with this name already exists.");
        //         return;
        // }
        if (entityData.id !== undefined)
            notification.destroyToastForKey(entityData.id);


        this._diagram.startTransaction("Add/Edit Entity " + entityData.entityName);

        if (entityData.id !== undefined) {
            var entity = this._diagram.model.findNodeDataForKey(entityData.id);
            this._diagram.model.setDataProperty(entity, "properties", entityData.properties);
            this._diagram.model.setDataProperty(entity, "entityName", entityData.entityName);
        }
        else {
            if (x && y) {
                this._diagram.model.addNodeData({
                    key: entityData.entityName,
                    entityName: entityData.entityName,
                    location: new go.Point(parseFloat(x), parseFloat(y)),
                    properties: entityData.properties,
                    category: "entity"
                });
            } else {
                this._diagram.model.addNodeData({
                    key: entityData.entityName,
                    entityName: entityData.entityName,
                    properties: entityData.properties,
                    category: "entity"
                });
            }
            suggestEntityAndRelation(entityData);
        }
        this._diagram.commitTransaction("Add/Edit Entity " + entityData.entityName);
    },

    /**
     * Retrieves a list of all Entities in the current model
     * @filters array of ids to be excluded from the list, if the array is empty or filter is not set, no filtering will be done
     */
    getEntityList: function (filters) {
        return this._diagram.model.nodeDataArray.filter(function (nodeData) {
            var retVal = nodeData.category === "entity";
            if (typeof  filters !== "undefined" && Array.isArray(filters))
                retVal = retVal && (filters.indexOf(nodeData.key) === -1);
            return retVal;
        })
    },


    /**
     * Retrieves the data of a specified entity
     * @param id
     * @return Entity
     */
    getEntityData: function (id) {
        return this._diagram.model.findNodeDataForKey(id);
    },

    deleteEntity: function (id) {
        this._deleteNode(id);
    },

    _deleteNode: function (id) {
        this._diagram.startTransaction("Remove node " + id);
        this._diagram.remove(this._diagram.findNodeForKey(id));
        this._diagram.commitTransaction("Remove node " + id);
    },

    /**
     * Adds a relationship between two entities
     *
     * @param linkData data of the relationship. It is an obejct with the following properties:
     *      source: String <-- Id of the Source Entity
     *      target: String <-- Id of the Target Entity
     *      name: String
     *      sourceRole: String
     *      sourceMultiplicity: String
     *      targetRole: String
     *      targetMultiplicity: String
     *
     * @param x abscissa of the point where the diamond is to be added to the diagram
     * @param y ordinate of the point where the diamond is to be added to the diagram
     */
    addRelationship: function (linkData, x, y) {

        var relName = "R_" + linkData.name;
        var relNameSuffix = 0;

        while (this._diagram.model.findNodeDataForKey(relName + "_" + relNameSuffix) !== null) {
            relNameSuffix++;
        }

        relName = relName + "_" + relNameSuffix;

        this._diagram.startTransaction("Add Relationship " + relName);

        if (x && y) {
            this._diagram.model.addNodeData({
                key: relName,
                location: new go.Point(parseFloat(x), parseFloat(y)),
                relationshipName: linkData.name,
                category: "relationshipDiamond"
            });
        } else {
            this._diagram.model.addNodeData({
                key: relName,
                relationshipName: linkData.name,
                category: "relationshipDiamond"
            });
        }
        //Adding Diamond


        //Adding Source Link
        this._diagram.model.addLinkData({
            from: linkData.source,
            to: relName,
            role: linkData.sourceRole,
            multiplicity: linkData.sourceMultiplicity,
            category: "relationshipLine"
        });

        //Adding Target Link
        this._diagram.model.addLinkData({
            from: linkData.target,
            to: relName,
            role: linkData.targetRole,
            multiplicity: linkData.targetMultiplicity,
            category: "relationshipLine"
        });

        this._diagram.commitTransaction("Add Relationship " + relName);
	    checkThirdSingular(linkData.name, relName);
        console.log(linkData.source);
	    //suggestRelation(linkData.source, linkData.target, relName);
	    suggestBetterName(relName, linkData.name, linkData.target, linkData.source);
    },

    getRelationshipData: function (id) {
        var node = this._diagram.findNodeForKey(id);
        var data = node.data;
        var links = node.findLinksConnected();


        var link = links.first().data;
        data.source = link.from;
        data.sourceMultiplicity = link.multiplicity;
        data.sourceRole = link.role;

        links.next();
        link = links.value.data;
        data.target = link.from;
        data.targetMultiplicity = link.multiplicity;
        data.targetRole = link.role;

        return data;
    },

    deleteRelationship: function (id) {
        this._deleteNode(id);
    },


    /**
     * Adds a Gen-Spec Relatonship between two or more entities
     * @param gsData data of the GS Relationship. it is an Object with the following properties
     *              parent: <-- id of the parent Entity
     *              children:  <--Array of child Entity node ids
     *              isPartial: boolean,
     *              isDisjoint: boolean
     *
     * @param x abscissa of the point where the circle is to be added to the diagram
     * @param y ordinate of the point where the circle is to be added to the diagram
     */
    addGeneralizationSpecialization: function (gsData, x, y) {
        var relName = "GS_" + gsData.parent;
        var node = this._diagram.model.findNodeDataForKey(relName);

        if (node !== null) {
            console.log(moodler.getGeneralizationSpecializationData(relName));
            throw new Error("A Gen/Spec for the parent already exists.");
        }

        this._diagram.startTransaction("Add Gen/Spec " + relName);

        //adding Circle
        this._diagram.model.addNodeData({
            key: relName,
            location: new go.Point(parseFloat(x), parseFloat(y)),
            exclusiveness: gsData.isDisjoint ? "d" : "o",
            category: "generalizationSpecializationCircle"
        });

        //adding gneralization line
        this._diagram.model.addLinkData({
            from: gsData.parent,
            to: relName,
            category: gsData.isPartial ? "partialGeneralizationLine" : "totalGeneralizationLine"
        });

        // add target lines
        for (var i = 0; i < gsData.children.length; i++) {
            var child = gsData.children[i];
            this._diagram.model.addLinkData({
                from: child,
                to: relName,
                category: "specializationLine"
            });

        }


        this._diagram.commitTransaction("Add Gen/Spec " + relName);
        console.log(moodler.getGeneralizationSpecializationData(relName));
    },

    addGeneralizationChild: function(parent, child){
        this._diagram.startTransaction("Add Child " + child);
        this._diagram.model.addLinkData({
            from: child,
            to: "GS_"+parent,
            category: "specializationLine"
        });
        this._diagram.commitTransaction("Add Child " + child);
    },

    existParentChild: function(parent, child){
        if(moodler.existNode("GS_"+parent)) {
            var node = this._diagram.findNodeForKey("GS_"+parent);
            if (node.data.exclusiveness!==undefined) {
                var data = moodler.getGeneralizationSpecializationData("GS_"+parent);
                if(data!==undefined && data.subclasses!==undefined){
                for (var i = 0; i < data.subclasses.length; i++) {
                    if (data.subclasses[i] == child) {
                        return true;
                    }
                }
                }
            }
        }
        return false;
    },

    getGeneralizationSpecializationData: function (id) {
        var node = this._diagram.findNodeForKey(id);
        var data = node.data;
        var links = node.findLinksConnected();
        data.subclasses = [];
        data.isDisjoint =  node.data.exclusiveness.toUpperCase() === "D";
        while(links.next()) {
            var linkData = links.value;
            if (linkData.category === "specializationLine")
                data.subclasses.push(linkData.data.from);
            else{
                data.superclass = linkData.data.from;
                data.isPartial = linkData.category === "partialGeneralizationLine";
            }

        }

        return data;
    },

    existNode: function (id){
        var node = this._diagram.findNodeForKey(id);
        if(node===null){
            return false;
        }else{
            return true;
        }
    },

    deleteGeneralizationSpecialization: function (id) {
        this._deleteNode(id);
    },

    toJSON: function () {
        var json = this._diagram.model.toJSON();
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("quicksave", "");
        } else {
            // Sorry! No Web Storage support..
        }
        return json;
    },

    fromJSON: function (jsonData) {
        this._diagram.model = go.Model.fromJson(jsonData);
    },

    toPNG: function () {
        return this._diagram.makeImageData({
            scale: 1
        });

    }
}
;
//# sourceURL=moodler.js