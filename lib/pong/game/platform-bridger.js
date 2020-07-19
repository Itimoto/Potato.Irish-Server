const AbsoluteBounds = {
    width   : 1000,
    height  : 1000,
}

/**
 * 
 * @param {Array} WindowBounds -- Array of 'Bounds' Objects containing Width and Height for its respective Canvas/Window 
 */
module.exports = {
    computeAspectRatio : function (WindowBounds){
        // Find the smallest Widths/Heights relative to their own Widths/Heights, send back the lowest
        let widths = [], heights = [];
        WindowBounds.forEach( (bounds) => {
            let absWidth = bounds.width/bounds.height; //Similar to Traditional Aspect Ratio (16:9) -> 16/9, etc.
            let absHeight = bounds.height/bounds.width;

            console.log("Width: " + absWidth, "\tHeight: " + absHeight);

            widths.push(absWidth);
            heights.push(absHeight);
        });

        return {
            width   : widths[0]  <= widths[1]  ? widths[0]  : widths[1],
            height  : heights[0] <= heights[1] ? heights[0] : heights[1],
        }
    },
    
    getAbsoluteBounds(aspectRatio){
        return {
            width   : AbsoluteBounds.width * aspectRatio,
            height  : AbsoluteBounds.height,
        }
    }
}