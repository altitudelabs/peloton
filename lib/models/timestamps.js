
module.exports = exports = function timestamps (schema, options) {
    schema.add({ createdAt: Date });
    schema.add({ updatedAt: Date });

    schema.pre('save', function(next){
        this.updatedAt = new Date;
        if ( !this.createdAt ) {
            this.createdAt = this.updatedAt;
        }
        next();
    });

    if (options && options.index) {
        schema.path('createdAt').index(options.index);
        schema.path('updatedAt').index(options.index);
    }
}
