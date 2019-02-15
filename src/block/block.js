/**
 * BLOCK: Background with Scrim
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InspectorControls, AlignmentToolbar, BlockAlignmentToolbar, BlockControls, InnerBlocks, MediaUpload, ColorPalette, RichText } = wp.editor;
const { Button, RangeControl, SelectControl } = wp.components;
const { Fragment } = wp.element;
console.log(wp);

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-background-with-scrim', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Background with Scrim' ), // Block title.
	icon: <i class="background-with-scrim-icon"></i>, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'layout', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Background with Scrim' ),
		__( 'thee' ),
	],

	attributes : {
        content: {
            type: 'string',
            source: 'html',
            selector: 'p',
        },
        headline: {
            type: 'string',
            source: 'html',
            selector: 'h2',
        },
        subheadline: {
            type: 'string',
            source: 'html',
            selector: 'h3',
        },
        fontColor: {
        	type: 'string',
        	default: 'black',
        },
	    overlayColor: { // new!
	        type: 'string',
	        default: 'black'
	    },
	    opacity: {
	    	default: 50
	    },
	    textAlign: {
	    	default: null,
	    },
	    sizing: {
	    	default: 'default'
	    },
	    backgroundAttachment: {
	    	default: 'local'
	    },
	    imageAlt: {
	      attribute: 'alt',
	      selector: '.card__image'
	    },
	    imageUrl: {
	      attribute: 'src',
	      selector: '.card__image'
	    }
	},

	supports: {
    	align: true
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function( props ) {

		var {template, templates} = props.attributes;

		function onOverlayColorChange(changes) {
		    props.setAttributes({
		        overlayColor: changes
		    })
		}
		function onFontColorChange(changes) {
		    props.setAttributes({
		        fontColor: changes
		    })
		}

		// console.log(wp);
		const getImageButton = (openEvent) => {
		  if(props.attributes.imageUrl) {
		    return (
		      <Fragment>
		      	<div className="media-button">
			      	<Button
			      		onClick={() => props.setAttributes({ imageAlt: null, imageUrl: null })}
			      		className="button button-large "
		    	  	>
		      			Remove Section Background
		      		</Button>
		      		<Button
		      			onClick={ openEvent }
		      			className="button button-large"
		      		>
		      			Change background-image
		      		</Button>
				</div>
			    <img 
			        src={ props.attributes.imageUrl }
		    	    className="section-background-image"
		      	/>


		      </Fragment>
		    );
		  }
		  else {
		    return (
		      <div className="media-button">
		        <Button 
		          onClick={ openEvent }
		          className="button button-large"
		        >
		          Add Section Background
		        </Button>
		      </div>
		    );
		  }
		};



		console.log(SelectControl);

		return (
			<Fragment>
			<BlockControls>
				<AlignmentToolbar
				    value={ props.attributes.textAlign }
				    onChange={ value => props.setAttributes({ textAlign: value }) }
				/>
			</BlockControls>
		    <InspectorControls>
			    <RangeControl
			        label="Opacity"
			        value={ props.attributes.opacity }
			        onChange={ ( opacity ) => props.setAttributes( { opacity } ) }
			        min={ 1 }
			        max={ 100 }
			    />

			    <h3>Overlay Color</h3>
			    <ColorPalette
		            value={props.attributes.overlayColor}
		            onChange={onOverlayColorChange}
		        />

		        <hr />
		        <h3>Font Color</h3>
				<ColorPalette
		            value={props.attributes.fontColor}
		            onChange={onFontColorChange}
		        />
		        <hr />
		        <SelectControl 			        	
			        label="Size"
			        value={ props.attributes.sizing }
			        options={ [
			        	{ label: 'Default', value: 'default'},
			            { label: 'Full Window Height', value: 'full-window' },
			            { label: 'Large', value: 'large'}
			        ] }
			        onChange={value => props.setAttributes({ sizing: value })}
		        />
		        <hr />
		        <SelectControl 			        	
			        label="Size"
			        value={ props.attributes.backgroundAttachment }
			        options={ [
			        	{ label: 'Default', value: 'default'},
			        	{ label: 'Fixed', value: 'fixed'}
			        ] }
			        onChange={value => props.setAttributes({ backgroundAttachment: value })}
		        />
		    </InspectorControls>
				<section className={ props.className + " page_section"} style={{"--section-font-color": props.attributes.fontColor}}>
					<div className="section-background">
						<div class="background-image-overlay" style={{"background-color":  props.attributes.overlayColor, opacity: "calc(" + props.attributes.opacity + " / 100)"}}></div>
				        <MediaUpload
				          onSelect={ media => { props.setAttributes({ imageAlt: media.alt, imageUrl: media.url }); } }
				          type="image"
				          value={ props.attributes.imageID }
				          render={ ({ open }) => getImageButton(open) }
				        />
					</div>

					<InnerBlocks />
				</section>
			</Fragment>
		);
	},



	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( props ) {
		const { content, attributes } = props;
		console.log(props);

		return (
	        <section class={"page_section align" + props.attributes.align + " text-align-" + props.attributes.textAlign + " sizing-" + props.attributes.sizing}  style={"--section-font-color:"  + props.attributes.fontColor +  ";"} id="testing">
	            <div class="section-background" style={"background-image: url('" + props.attributes.imageUrl +  "'); background-attachment: " + props.attributes.backgroundAttachment + ";"}>
	                <div class="background-image-overlay" style={"background-color:" +  props.attributes.overlayColor +  "; opacity: calc(" + props.attributes.opacity + " / 100);"}></div>
	            </div>	    

	            <div class="section-content page-content composition">
                        <InnerBlocks.Content />             
	            </div>
	        </section>
		);
	},
} );
